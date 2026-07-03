import React, { useState,useEffect } from 'react'
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { getOrganizationsApi,loginApi,signupApi } from '../services/allApi'
import {useNavigate} from 'react-router-dom'


function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [orgList, setOrgList] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    orgId: ''
  })
  const navigate=useNavigate()
  useEffect(() => {
    if (!isLogin) {
      fetchOrganizations()
    }
  }, [isLogin])

  const fetchOrganizations = async () => {
    try {
      const res = await getOrganizationsApi()
      setOrgList(res.data)
    } catch (err) {
      toast.error('Could not load organizations')
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (isLogin) {
      if (!formData.email || !formData.password) {
        toast.warning('Please enter your email and password.')
        return
      }

      try {
        const res = await loginApi({
          email: formData.email,
          password: formData.password
        })

        if (res.status === 200) {
          localStorage.setItem('token', res.data.token)
          toast.success('Login successful!')
          navigate('/dashboard')
        }
        } catch (err) {
        toast.error(err.response?.data?.error || 'Something went wrong')
      }

      return
    }
    if (!formData.name || !formData.email || !formData.password || !formData.orgId) {
      toast.warning('Please fill in all fields to create an account.')
      return
    }

    try {
      const res = await signupApi(formData)

      if (res.status === 201) {
        toast.success('Account created successfully! Please login.')
        setIsLogin(true)
        setFormData({ name: '', email: '', password: '', orgId: '' })
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong')
    }
  }

  

  

  return (
    <Container className="min-vh-100 d-flex align-items-center py-5">
      <Row className="w-100 justify-content-center">
        <Col xs={12} sm={10} md={7} lg={5}>
          <Card className="shadow-sm border-0">
            <Card.Body className="p-4 p-md-5">
              <div className="text-center mb-4">
                <h2 className="fw-bold mb-2">{isLogin ? 'Admin Login' : 'Create Admin Account'}</h2>
                <p className="text-muted mb-0">
                  {isLogin ? 'Sign in to continue to your dashboard.' : 'Set up your admin account.'}
                </p>
              </div>

              <Form onSubmit={handleSubmit}>
                {!isLogin && (
                  <>
                  <Form.Group className="mb-3" controlId="formName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={e=>setFormData({...formData,name:e.target.value})}
                    />
                  </Form.Group>
                <Form.Group className="mb-3" controlId="formOrg">
                      <Form.Label>Organization</Form.Label>
                      <Form.Select
                        name="orgId"
                        onChange={e=>setFormData({...formData,orgId:e.target.value})}
                      >
                        <option value="">Select your organization</option>
                        {orgList.map((org) => (
                          <option key={org._id} value={org._id}>
                            {org.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>

                  </>
                  
                  
                )}

                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={e=>setFormData({...formData,email:e.target.value})}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={e=>setFormData({...formData,password:e.target.value})}
                  />
                </Form.Group>

                <div className="d-grid mt-4">
                  <Button variant="primary" type="submit">
                    {isLogin ? 'Sign In' : 'Create Account'}
                  </Button>
                </div>
              </Form>

              <div className="text-center mt-3">
                <span className="text-muted">
                  {isLogin ? 'New here?' : 'Already have an account?'}
                </span>{' '}
                <Button variant="link" className="p-0 align-baseline" onClick={toggleMode}>
                  {isLogin ? 'Create an account' : 'Sign in'}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Auth

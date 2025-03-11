import React from 'react';
import { Container, Card, Accordion, Form, Button } from 'react-bootstrap';

export const Terms = () => (
    <Container className="mt-5">
        <Card>
            <Card.Body>
                <Card.Title>Terms of Service</Card.Title>
                <Card.Text>
                    By using MarketHub, you agree to our terms of service. These include...
                </Card.Text>
                <Accordion>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Usage Policy</Accordion.Header>
                        <Accordion.Body>
                            You agree to use MarketHub responsibly and not engage in any...
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="1">
                        <Accordion.Header>Payment Terms</Accordion.Header>
                        <Accordion.Body>
                            All payments are securely processed through our payment gateway...
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Card.Body>
        </Card>
    </Container>
);

export const PrivacyPolicy = () => (
    <Container className="mt-5">
        <Card>
            <Card.Body>
                <Card.Title>Privacy Policy</Card.Title>
                <Card.Text>
                    Your privacy is our priority. We ensure that your data is protected...
                </Card.Text>
                <Accordion>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Data Collection</Accordion.Header>
                        <Accordion.Body>
                            We collect data such as email, phone, and address to provide...
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="1">
                        <Accordion.Header>Third-Party Sharing</Accordion.Header>
                        <Accordion.Body>
                            We do not share your personal data with third-party vendors...
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Card.Body>
        </Card>
    </Container>
);

export const ContactUs = () => (
    <Container className="mt-5">
        <Card>
            <Card.Body>
                <Card.Title>Contact Us</Card.Title>
                <Form>
                    <Form.Group className="mb-3" controlId="formName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter your name" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter your email" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formMessage">
                        <Form.Label>Message</Form.Label>
                        <Form.Control as="textarea" rows={3} />
                    </Form.Group>
                    <Button variant="primary" type="submit">Submit</Button>
                </Form>
            </Card.Body>
        </Card>
    </Container>
);

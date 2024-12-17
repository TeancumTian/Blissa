import { Button, Card, Form } from "react-bootstrap";
import styles from "./login.module.css";

export default function Login() {
  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <Card.Header className={styles.header}>
          <Card.Title className={styles.title}>BLISSA</Card.Title>
          <p className={styles.subtitle}>Simplify Skincare</p>
        </Card.Header>
        <Card.Body>
          <Form className={styles.form}>
            <Form.Group className={styles.inputGroup}>
              <Form.Label className={styles.label}>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="your@email.com"
                className={styles.input}
              />
            </Form.Group>
            <Form.Group className={styles.inputGroup}>
              <Form.Label className={styles.label}>Password</Form.Label>
              <Form.Control
                type="password"
                className={styles.input}
              />
            </Form.Group>
            <Button className={styles.loginButton}>Log In</Button>
          </Form>
          <div className={styles.forgotPassword}>
            <a
              href="#"
              className={styles.link}
            >
              Forgot password?
            </a>
          </div>
          <div className={styles.socialLogin}>
            <p className={styles.socialText}>Or log in with</p>
            <div className={styles.socialButtons}>
              <Button
                variant="outline-secondary"
                className={styles.socialButton}
              >
                <img
                  src="/images/placeholder.png"
                  alt="Google"
                  width={20}
                  height={20}
                  className={styles.socialIcon}
                />
                Google
              </Button>
              <Button
                variant="outline-secondary"
                className={styles.socialButton}
              >
                <img
                  src="/images/placeholder.png"
                  alt="Apple"
                  width={20}
                  height={20}
                  className={styles.socialIcon}
                />
                Apple
              </Button>
            </div>
          </div>
          <p className={styles.signupText}>
            Don't have an account?{" "}
            <a
              href="#"
              className={styles.link}
            >
              Sign up
            </a>
          </p>
        </Card.Body>
      </Card>
    </div>
  );
}

import React from 'react'
import AuthForm from './AuthForm';

function Login(props) {

    return (
        <div className="auth">
            <AuthForm
                name="login"
                onSubmit={props.onSubmit}
                title="Войти"
                buttonTitle="Войти"
            />
        </div>
    )
}

export default Login;
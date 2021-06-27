import React from 'react';
import {Link} from 'react-router-dom';
import AuthForm from "./AuthForm";

function Register(props) {

    return (
        <div className="register">
            <AuthForm
                name="registration"
                onSubmit={props.onSubmit}
                title="Регистрация"
                buttonTitle="Зарегистрироваться"
            />
            <p className="auth__text">Уже зарегистрированы? <Link to="/signin" className="auth__link">Войти</Link></p>
        </div>

    );
}

export default Register;
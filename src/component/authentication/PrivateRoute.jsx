import React, { Fragment } from 'react'
import { Redirect, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import Footer from '../menu/footer/Footer'
import Navbar from '../menu/navbar/Navbar';

const PrivateRoute = ({ component: Component, ...rest }) => {
    const customerLogin = rest.customer_login

    return (
    <Fragment>
        <Navbar />
        <Route
            {...rest}
            render={ props =>
                customerLogin ? (
                    <Component {...props} />
                ) : (
                    <Redirect to={{ pathname: '/', state: { from: props.location } }} />
                )
            }
        />
        <Footer />
    </Fragment>
)
}
const mapStateToProps = (state) => {
    return {
        customer_login: state.CUSTOMER_LOGIN
    }
}
export default connect(mapStateToProps, null) (PrivateRoute)
import React from 'react';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import About from '../pages/about/About';
import BlogDetail from '../pages/blog/BlogList/blogDetail/BlogDetail';
import BlogList from '../pages/blog/BlogList/BlogList';
import Contact from '../pages/contact/Contact';
import CustomerVoice from '../pages/customerVoice/CustomerVoice';
import DetailProduct from '../pages/DetailProduct';
import LandingPage from '../pages/LandingPage';
import Login from '../pages/Login';
import Profile from '../pages/profile/Profile';
import ServiceCenter from '../pages/serviceCenter/ServiceCenter';
import ServiceStatus from '../pages/serviceStatus/ServiceStatus';
import Shop from '../pages/shop/Shop';
import Location from '../pages/shop/Location';
import Register from '../pages/register/Register';
import UserRegisterProduct from '../component/product/userRegisterProduct/UserRegisterProduct';
import AllProduct from '../component/product/allProduct/AllProduct';
import CameraScan from '../component/scan/cameraScan/CameraScan';
import ForgotPassword from '../pages/forgotPassword/forgotPassword/ForgotPassword';
import FormOtp from '../pages/forgotPassword/formOtp/FormOtp';
import ChangePassword from '../pages/forgotPassword/changePassword/ChangePassword';
import PrivateRoute from '../component/authentication/PrivateRoute';
import RegisterOtp from '../component/register/registerOtp/RegisterOtp';
import NotFound from '../component/errorPage/notFound/Notfound';
import DetailStatusService from '../component/serviceStatus/detailStatusService/DetailStatusService';

const LandingPageRouter = () => {
  return (
    <Router forceRefresh={true}>
      <Switch>
        {/* ROUTER COSTOMER */}
        <Route exact path="/" component={Login}></Route>
        <Route
          exact
          path="/forgot-password/"
          component={ForgotPassword}
        ></Route>
        <Route exact path="/otp/:userID" component={FormOtp}></Route>
        <Route
          exact
          path="/reset-password/:userID/:tokenReset"
          component={ChangePassword}
        ></Route>
        <Route exact path="/register" component={Register}></Route>
        <Route
          exact
          path="/register_otp/:userID/:phoneNumber"
          component={RegisterOtp}
        ></Route>

        <PrivateRoute
          exact
          path="/landing-page"
          component={LandingPage}
        ></PrivateRoute>

        <PrivateRoute
          exact
          path="/product/detail/:id"
          component={DetailProduct}
        ></PrivateRoute>
        <PrivateRoute
          exact
          path="/product/register-product/:barcode"
          component={UserRegisterProduct}
        ></PrivateRoute>
        <PrivateRoute
          exact
          path="/product/all-product"
          component={AllProduct}
        ></PrivateRoute>

        <PrivateRoute exact path="/shop-list" component={Shop}></PrivateRoute>
        <PrivateRoute
          exact
          path="/shop-location/:latitude/:longitude"
          component={Location}
        ></PrivateRoute>

        <PrivateRoute
          exact
          path="/service-center-list"
          component={ServiceCenter}
        ></PrivateRoute>
        <PrivateRoute
          exact
          path="/service-status"
          component={ServiceStatus}
        ></PrivateRoute>
        <PrivateRoute
          exact
          path="/service-status/detail/:id"
          component={DetailStatusService}
        ></PrivateRoute>

        <PrivateRoute
          exact
          path="/blog/list"
          component={BlogList}
        ></PrivateRoute>
        <Route exact path="/blog/detail/:slug" component={BlogDetail}></Route>

        <PrivateRoute exact path="/about" component={About}></PrivateRoute>
        <PrivateRoute exact path="/contact" component={Contact}></PrivateRoute>
        <PrivateRoute exact path="/profile" component={Profile}></PrivateRoute>
        <PrivateRoute
          exact
          path="/customer-voice"
          component={CustomerVoice}
        ></PrivateRoute>

        <PrivateRoute
          exact
          path="/scaner"
          component={CameraScan}
        ></PrivateRoute>
        {/* END ROUTER COSTOMER */}

        <Route component={NotFound} />
      </Switch>
    </Router>
  );
};

export default LandingPageRouter;

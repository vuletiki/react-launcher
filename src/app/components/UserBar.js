import React from 'react';
import { Link } from 'react-router';
import GoogleLoginBtn from './GoogleLoginBtn';
import FacebookLoginBtn from './FacebookLoginBtn';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './../styles/user-bar.scss';

import { Skeleton } from './../../global';

class UserBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoginTooltip: false,
            showUserMenu: false
        };
    }

    componentDidMount() {

        if(localStorage){
            var tokenData = localStorage.getItem('customer_token');
            this.props.fetchInfo(JSON.parse(tokenData));
        }

        let state = {
            ...this.state,
            isLogin: this.props.user !== null,
            user: this.props.user
        };
        this.setState(state);
    }

    componentWillReceiveProps(nextProps) {
        let state = {
            ...this.state,
            isLogin: nextProps.user !== null && nextProps.user !== false,
            user: nextProps.user,
            showUserMenu: false
        };
        this.setState(state);
    }

    responseGoogleLogin (info) {
        this.props.loginWithToken(info.access_token, 'google');
    }
    responseFacebookLogin (info) {
        this.props.loginWithToken(info.accessToken, 'facebook');
    }

    getLoginTooltip() {
        if(this.state.showLoginTooltip) 
            return (<div className={s.popup}>
                    <GoogleLoginBtn onClick={this.loginTolltipToggle.bind(this)} socialId="60036624360-59ceaveq0votucv9inc7fvn2u70c6cg8.apps.googleusercontent.com"
                         scope="profile email openid"
                         responseHandler={this.responseGoogleLogin.bind(this)} >
                    </GoogleLoginBtn>
                    <FacebookLoginBtn onClick={this.loginTolltipToggle.bind(this)}
                        appId="580525262157720"
                        // autoLoad={true}
                        fields="name,email,picture"
                        callback={this.responseFacebookLogin.bind(this)}
                        cssClass="my-facebook-button-class"
                        redirectUri="http://localhost:5000"
                        icon="fa-facebook">
                    </FacebookLoginBtn>
                </div>);
    }

    loginTolltipToggle() {
        this.setState({
            showLoginTooltip: !this.state.showLoginTooltip
        })
    }
    menuToggle() {
        const show = !this.state.showUserMenu;
        // if(show) {
        //     document.addEventListener("click", this.menuToggle.bind(this));
        // } else {
        //     document.removeEventListener("click", this.menuToggle.bind(this));
        // }
        this.setState({
            showUserMenu: show
        })
    }
    logout(e) {
        e.preventDefault();
        this.props.logout();
    }
    getMenu() {
        if(this.state.showUserMenu) {
            return <div className={s.userMenuContent}>
                <a href="javascript:" onClick={this.logout.bind(this)}>Đăng xuất</a>
            </div>;
        }
    }
    render() {
        if(this.state.user === false) {
            return <div className={s.root}>
                <Skeleton w="75px" h="26px" fl="right" />
            </div>
        }
        if(this.state.isLogin){
            let user = this.props.user;
            return <div className={s.root}>
                <Link to = "notice" title="Thông báo của bạn"><i className="ion-android-notifications" /></Link>
                <Link to="/me" className={s.userLink}>
                    <img src={user.image} />
                </Link>
                <div className={s.userMenu}>
                    <button onClick={this.menuToggle.bind(this)}><i className="ion-navicon"/></button>
                    {this.getMenu()}
                </div>
            </div>;
        }
        else
            return <div className={s.root}>
                <a title="Đăng nhâp" className={s.showLogin} href="javascript:" onClick={this.loginTolltipToggle.bind(this)}>
                    Đăng nhập với <span className={s.loginGoogleIcon}><i className="ion-social-google-outline" /></span> hoặc <span className={s.loginFacebookIcon}><i className="ion-social-facebook" /></span>
                </a>
                {this.getLoginTooltip()}
            </div>;
    }
}

export default withStyles(s)(UserBar);
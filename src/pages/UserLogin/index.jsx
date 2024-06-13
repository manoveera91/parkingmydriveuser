import { useEffect, useState } from "react";
import BreadCrumbs from "../../components/BreadCrumbs";
import Apple from "../../assets/images/apple.png";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import AxiosClient from "../../axios/AxiosClient";
import GoogleLogin from "../googleLogin/index"
import { GoogleOAuthProvider } from '@react-oauth/google';
import React from "react";
import { useDispatch } from "react-redux";
import { saveUser } from "../../redux/userSlice";
import FacebookLogin from 'react-facebook-login';
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "../Login";
import Register from "../Register";
import Loader from "../../components/Loader";
import OwnerAxiosClient from "../../axios/OwnerAxiosClient";
import { toast } from "react-toastify";
const UserLogin = () => {
    const handleDataChange = (newData) => {
        setLoading(newData);
    };
    const dispatch = useDispatch();
    const searchRedux = useSelector((state) => {
        return state.search.value;
    });
    const userRedux = useSelector((state) => {
        return state.user.value;
    });

    console.log("userredux", userRedux);
    console.log("searchstate", searchRedux);

    const [logginClicked, setLogginClicked] = useState(false);
    const [signUpClicked, setSignUpClicked] = useState(false);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const responseFacebook = (response) => {
        console.log(response);
        ownerSubmit(response.name, response.email, response.id);
        // handleSubmit(response.name, response.email, response.id);
    }

    const handleGoogleResponse = (response) => {
        // Perform actions with the received data
        console.log('Received data from GoogleLogin:', response);
        loginSubmit(response.name, response.email, response.sub);
        // handleSubmit(response.name, response.email, response.sub)
    };

    const loginSubmit = async (name, email, pass) => {
        try {
            setLoading(true); // Set loading state to true when API call sta
            await OwnerAxiosClient.get("/sanctum/csrf-cookie");
            const { data, error, status } =
                await OwnerAxiosClient.post("/api/auth/ownersociallogin", {
                    username: name,
                    email: email,
                    password: pass,
                    mobile: '9999999999'
                });
            if (error) {
                localStorage.clear();
                setError(error);
                setLoading(false); 
                return;
            }
            if (status === 200) {
                localStorage.setItem('spotLength', data.spot_length);
                localStorage.setItem("isAuthenticated", true);
                localStorage.setItem("ACCESS_OWNER_TOKEN", data.owner_access_token);
                localStorage.setItem("ACCESS_TOKEN", data.user_access_token);
                toast.success("Login successfully!");
                const redirect = localStorage.getItem('redirect')
                if (redirect) {
                    navigate(redirect);
                    localStorage.removeItem('redirect');
                } else {
                    navigate("/dashboard");
                }

                dispatch(
                    saveUser({
                        data: {
                            isLoggedIn: true,
                            username: data.user.name,
                            email: data.user.email,
                            token: data.user_access_token,
                            mobile: data.user.mobile,
                            spotLength: data.spot_length ? data.spot_length : 0
                        },
                    })
                );
            } else {
                localStorage.clear();
                setError(error);
                setLoading(false);
                return;
            }
        } catch (error) {
            setLoading(false);
            console.log("Error:", error);
            if (error.response && error.response.status === 409) {
                setError("Email already exists. Please use a different email.");
            } else {
                setError("Internal server error. Please try again later.");
            }
        } 
    }

    const ownerSubmit = async (name, email, pass) => {
        try {
            setLoading(true); // Set loading state to true when API call sta
            await OwnerAxiosClient.get("/sanctum/csrf-cookie");
            const { data, error, status } =
                await OwnerAxiosClient.post("/api/auth/ownersociallogin", {
                    username: name,
                    email: email,
                    password: pass
                });
            if (error) {
                localStorage.clear();
                setError(error);
                setLoading(false); 
                return;
            }
            if (status === 201 || status === 200) {
                localStorage.setItem('spotLength', data.spot_length);
                localStorage.setItem("isAuthenticated", true);
                localStorage.setItem("ACCESS_OWNER_TOKEN", data.access_token);
                handleSubmit(name, email, pass, data.spot_length);
            } else {
                localStorage.clear();
                setError(error);
                setLoading(false);
                return;
            }
        } catch (error) {
            setLoading(false);
            console.log("Error:", error);
            if (error.response && error.response.status === 409) {
                setError("Email already exists. Please use a different email.");
            } else {
                setError("Internal server error. Please try again later.");
            }
        } 
    }

    const handleSubmit = async (name, email, pass, spotLength) => {
        try {
            // setLoading(true); // Set loading state to true when API call sta
            await AxiosClient.get("/sanctum/csrf-cookie");
            const { data, error, status } =
                await AxiosClient.post("/api/auth/sociallogin", {
                    name: name,
                    email: email,
                    password: pass,
                    mobile: '9999999999'
                });
            console.log("errior response", error);
            if (error) {
                setError(error);
                setLoading(false);
                return;
            }
            if (status === 200 || status === 201) {
                toast.success("Login successfully!");
                localStorage.setItem("ACCESS_TOKEN", data.accessToken);
                const redirect = localStorage.getItem('redirect')
                if (redirect) {
                    navigate(redirect);
                    localStorage.removeItem('redirect');
                } else {
                    navigate("/dashboard")
                }

                dispatch(
                    saveUser({
                        data: {
                            isLoggedIn: true,
                            username: data.user.name,
                            email: data.user.email,
                            token: data.accessToken,
                            mobile: data.user.mobile,
                            spotLength: spotLength ? spotLength : 0
                        },
                    })
                );
            } else {
                localStorage.clear();
                setError(error);
                setLoading(false);
                return;
            }
        } catch (error) {
            setLoading(false);
            console.log("Error:", error);
            if (error.response && error.response.status === 409) {
                setError("Email already exists. Please use a different email.");
            } else {
                setError("Internal server error. Please try again later.");
            }
        } finally {
            setLoading(false); // Set loading state to false when API call completes
        }
    };

    return (
        <>
            {/* <Header /> */}
            <BreadCrumbs title={"Login"} />
            <div className="loginOuter">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 mx-auto">
                            <div className="card px-3">
                                <div className="row">
                                    <div className="col-lg-8 col-md-12 card-body">
                                        {loading ? (
                                            <div className="loader"> <Loader /></div>
                                        ) : ''}
                                        {!userRedux.isLoggedIn && (
                                            <div
                                                id="form-credit-card"
                                                className="bg-lighter rounded">
                                                <h4 className="">Let's gets started</h4>
                                                {/* <form> */}
                                                <div className={loading ? 'form-disabled' : ''}>
                                                    <div className="row">
                                                        <div className="col-lg-4 mb-2">
                                                            <div className="loginasIcon" onClick={() => {
                                                                setLogginClicked(false);
                                                                setSignUpClicked(false);
                                                            }}>
                                                                <GoogleOAuthProvider clientId={import.meta.env.VITE_APP_GG_APP_ID}>
                                                                    <GoogleLogin onGoogleResponse={handleGoogleResponse} />
                                                                </GoogleOAuthProvider>
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-4 mb-2">
                                                            <div className="facebookloginicon loginasIcon">
                                                                <a onClick={() => {
                                                                    setLogginClicked(false);
                                                                    setSignUpClicked(false);
                                                                }}>
                                                                    <FacebookLogin
                                                                        appId={import.meta.env.VITE_APP_FB_APP_ID}
                                                                        fields="name,email,id"
                                                                        textButton=""
                                                                        icon="fa-facebook"
                                                                        tag={'div'}
                                                                        cssClass="facebooklogin"
                                                                        callback={responseFacebook} />
                                                                </a>
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-4 mb-2">
                                                            <div className="loginasIcon form-disabled">
                                                                <a>
                                                                    <img src={Apple} />
                                                                </a>
                                                            </div>
                                                        </div>

                                                        {!logginClicked && (
                                                            <div className="col-xl-12 col-md-12 mb-2">
                                                                <div className="loginasIcon cursor-pointer">
                                                                    <a
                                                                        onClick={() => {
                                                                            setLogginClicked(true);
                                                                            setSignUpClicked(false);
                                                                        }}
                                                                    >
                                                                        Login with email
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {!userRedux.isLoggedIn && logginClicked && <Login onDataChange={handleDataChange}/>}
                                                        {!userRedux.isLoggedIn && signUpClicked && (
                                                            <Register onDataChange={handleDataChange} />
                                                        )}
                                                        {!signUpClicked && (
                                                            <>
                                                                <div className="col-xl-12 col-md-12 mb-2">
                                                                    <div className="loginasIcon text-center">
                                                                        or
                                                                    </div>
                                                                </div>
                                                                <div className="col-xl-12 col-md-12 mb-2">
                                                                    <div className="loginasIcon">
                                                                        <a
                                                                            onClick={() => {
                                                                                setSignUpClicked(true);
                                                                                setLogginClicked(false);
                                                                            }}
                                                                        >
                                                                            Signup with email
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default UserLogin;

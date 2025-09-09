import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { AppContext } from "../contexts/AppContext";
import VerifyAccount from "./verifyaccount";

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { setIsLoggedIn, siteurl } = useContext(AppContext);
    const [isVerifyAccount, setIsVerifyAccount] = useState(false);
    const [showPassword, setShowPassword] = useState(false);


    const handleSubmit = async (e) => {
        e.preventDefault();

        const url = siteurl + "/api/auth/login";
        try {
            const { data } = await axios.post(url, { email: email, password: password }, {
                withCredentials: true
            });

            if (data.notverified) {
                setIsVerifyAccount(true);
            } else {
                if (data.success === true) {
                    setIsLoggedIn(true);
                    localStorage.setItem("isLoggedIn", true);
                    toast(data.msg);
                    navigate("/profile");
                } else {
                    setIsLoggedIn(false);
                    localStorage.setItem("isLoggedIn", false);
                    toast.error(data.msg);
                }
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <>
            {!isVerifyAccount ?
                (
                    <div className="main_container">
                        <section className="form__section">
                            <form className="form" onSubmit={handleSubmit}>
                                <div className="form__title">Login Form</div>
                                <div className="form__sub-title">Please Sign In to Access Your Account</div>
                                <label className="form__input-label">Email</label>
                                <div className="form__input-wrapper">
                                    <input className="form__input" name="email" placeholder="Type your email..." type="text" onChange={(e) => setEmail(e.target.value)} />
                                </div>
                                <label className="form__input-label">Password</label>
                                <div className="form__input-wrapper">
                                    <input
                                        id="password-input"
                                        name="password"
                                        className="form__input form__input--has-svg"
                                        placeholder="Type your password..."
                                        type={showPassword ? "text" : "password"}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <div
                                        className="form__pass-toggle cursor-pointer"
                                        onClick={() => setShowPassword(prev => !prev)}
                                    >
                                        {showPassword ? (
                                            // 👁️‍🗨️ Eye Open (showing password)
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <g clipPath="url(#clip0_216_38)">
                                                    <path d="M0.833374 10C0.833374 10 4.16671 3.33331 10 3.33331C15.8334 3.33331 19.1667 10 19.1667 10C19.1667 10 15.8334 16.6666 10 16.6666C4.16671 16.6666 0.833374 10 0.833374 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0_216_38">
                                                        <rect width="20" height="20" fill="white" />
                                                    </clipPath>
                                                </defs>
                                            </svg>
                                        ) : (
                                            // 🙈 Eye Closed (hiding password)
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path d="M17.94 17.94C16.07 19.23 13.9 20 12 20C6 20 2 12 2 12C3.386 9.636 5.22 7.558 7.37 6.11M10.58 5.08C11.05 5.03 11.52 5 12 5C18 5 22 12 22 12C21.367 13.103 20.617 14.144 19.78 15.08M9.17 9.17C8.42 9.92 8 10.93 8 12C8 14.21 9.79 16 12 16C13.07 16 14.08 15.58 14.83 14.83M3 3L21 21"
                                                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                                <a href="/reset-password" className="form__remmember">Forgot your password?</a>
                                <button className="form__submit-btn">Submit</button>
                                <div onClick={() => navigate("/register")} className="form__sign-up cursor-pointer">Create a New Account</div>
                            </form>
                        </section>
                    </div>
                ) : (
                    <VerifyAccount email={email} setIsVerifyAccount={setIsVerifyAccount} />
                )
            }
        </>
    );
}

export default LoginForm;
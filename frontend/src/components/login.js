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
    const { setIsLoggedIn , siteurl } = useContext(AppContext);
    const [isVerifyAccount , setIsVerifyAccount] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const url = siteurl+"/api/auth/login";
        try {
            const {data} = await axios.post(url,{email:email,password:password},{
                withCredentials:true
            });

            if(data.notverified){
                setIsVerifyAccount(true);
            } else {
                if(data.success === true){
                    setIsLoggedIn(true);
                    localStorage.setItem("isLoggedIn",true);
                    toast(data.msg);
                    navigate("/dashboard");
                } else {
                    toast.error(data.msg);
                }
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

  return (
    <>
        { !isVerifyAccount ? 
            ( <section className="form__section">
                <form className="form" onSubmit={handleSubmit}>
                    <div className="form__title">Login Form</div>
                    <div className="form__sub-title">Please Sign In to Access Your Account</div>
                    <label className="form__input-label">Email</label>
                    <div className="form__input-wrapper">
                        <input className="form__input" name="email" placeholder="Type your email..." type="text" onChange={(e) => setEmail(e.target.value)}/>
                    </div>
                    <label className="form__input-label">Password</label>
                    <div className="form__input-wrapper">
                        <input id="password-input" name="password" className="form__input form__input--has-svg" placeholder="Type your password..."
                        type="password" onChange={(e) => setPassword(e.target.value)}/>
                        <div className="form__pass-toggle">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clipPath="url(#clip0_216_38)">
                                    <path
                                    d="M0.833374 9.99998C0.833374 9.99998 4.16671 3.33331 10 3.33331C15.8334 3.33331 19.1667 9.99998 19.1667 9.99998C19.1667 9.99998 15.8334 16.6666 10 16.6666C4.16671 16.6666 0.833374 9.99998 0.833374 9.99998Z"
                                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path
                                    d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z"
                                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_216_38">
                                    <rect width="20" height="20" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </div>
                    </div>
                    <a href="/reset-password" className="form__remmember">Forgot your password?</a>
                    <button className="form__submit-btn">Submit</button>
                    <div onClick={() => navigate("/register")} className="form__sign-up">Create a New Account</div>
                </form>
            </section>
            ) : (
                <VerifyAccount email={email} />
            )
        }
    </>
  );
}

export default LoginForm;
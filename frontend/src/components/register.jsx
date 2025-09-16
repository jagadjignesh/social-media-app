import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import VerifyAccount from "./verifyaccount";
import { AppContext } from "../contexts/AppContext";

const RegisterFrom = () => {
    const navigate = useNavigate();
    const [name , setName] = useState();
    const [email , setEmail] = useState();
    const [password , setPassword] = useState();
    const [isVerifyAccount , setIsVerifyAccount] = useState(false);
    const { siteurl } = useContext(AppContext);

    const HandleRegister = async (e) => {
        e.preventDefault();

        const url = siteurl+"/api/auth/register";
        try {
            const {data} = await axios.post(url,{name:name,email:email,password:password});

            if(data.success === true){
                setIsVerifyAccount(true);
            } else {
                toast.error(data.msg);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    return (
        <>
            {!isVerifyAccount ? (
                <div className="main_container">
                    <section className="form__section">
                        <form className="form" onSubmit={HandleRegister}>
                            <div className="form__title">Register Form</div>
                            <div className="form__sub-title">Please Sign Up to Access Your Account</div>
                            <label className="form__input-label">Username</label>
                            <div className="form__input-wrapper">
                                <input className="form__input" name="name" placeholder="Type your username..." type="text" onChange={(e) => setName(e.target.value)}/>
                            </div>
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
                            <button className="form__submit-btn">Submit</button>
                            <div onClick={() => navigate("/login")} className="form__sign-up cursor-pointer">Already have Account?.</div>
                        </form>
                    </section>
                </div>
            ) : (
                <VerifyAccount email={email} setIsVerifyAccount={setIsVerifyAccount} />
            )}
        </>
    );
}

export default RegisterFrom;
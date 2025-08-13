import { useContext, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "../contexts/AppContext";

const ResetPasswordEmailForm = () => {
    const [email , setEmail] = useState();
    const [linkSended , setLinkSended] = useState(false);
    const { siteurl } = useContext(AppContext); 

    const handleResetLinkSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = siteurl+"/api/auth/send-reset-password-email";

            const { data } = await axios.post(url,{email:email},{withCredentials:true});

            if(data.success === true){
                setLinkSended(true);
                toast.success(data.msg);
            } else {
                toast.error(data.msg);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    return (
        <>
            { !linkSended ? (
                <div className="main_container">
                    <section className="form__section">
                        <form className="form" onSubmit={handleResetLinkSubmit}>
                            <div className="form__title">Reset Password</div>
                            <div className="form__sub-title">Please Enter Your Registered Email</div>
                            <label className="form__input-label">Email</label>
                            <div className="form__input-wrapper">
                                <input className="form__input" name="email" placeholder="Type your email..." type="text" onChange={(e) => setEmail(e.target.value)}/>
                            </div>
                            <button className="form__submit-btn">Submit</button>
                        </form>
                    </section>
                </div>
            ) : (
                <div className="main_container">
                    <section className="form__section">
                        <div className="form">
                            <div className="form__title" style={{color:"green"}}>Thank You</div>
                            <h6>Reset password link sended to your email address , Please check email.</h6>
                        </div>
                    </section>
                </div>
            ) }
        </>
    )
}

export default ResetPasswordEmailForm;
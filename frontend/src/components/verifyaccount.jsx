import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContext } from "../contexts/AppContext";

const VerifyAccount = (props) => {

    const email = props.email;
    const navigate = useNavigate();
    const refArray = useRef([]);
    const { siteurl } = useContext(AppContext);

    useEffect(() => {
        refArray.current[0].focus();
    },[]);

    const otp_digit = 4;
    const [otpinput , setOtpInput] = useState(new Array(otp_digit).fill(''));

    const handelOnChangeOtp = (value, index) => {
        if(isNaN(value)) return;

        const otpArray = value.trim();
        const newArr = [...otpinput];
        newArr[index] = otpArray.slice(-1);
        setOtpInput(newArr);
        

        otpArray && refArray.current[index+1]?.focus();
    }
    
    const handleBackspaceOtp = (e,index) => {
        if(!e.target.value && e.key === "Backspace"){
            refArray.current[index-1].focus();
        }
    }

    const handlePasteOtp = (e) => {
        const paste = e.clipboardData.getData('text');
        const pasteArray = paste.split('');
        pasteArray.forEach((char, index) => {
            if(refArray.current[index]){
                console.log(refArray);
                refArray.current[index].value = char;
            }
        });
    }

    const verifyAccountHandleSubmit = async (e) => {
        e.preventDefault();
        const otpArray = refArray.current.map((e) => e.value);
        const otp = otpArray.join('');

        try {
            const url = siteurl+"/api/auth/verify-account";
            const {data} = await axios.post(url,{otp:otp,email:email},{
                withCredentials:true
            });

            if(data.success){
                toast.success(data.msg);
                navigate('/');
            } else {
                toast.error(data.msg);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    return (
        <>
            <div className="main_container">
                <section className="form__section">
                    <form className="form" onSubmit={verifyAccountHandleSubmit}>
                        <div className="form__title">Account verification</div>
                        <div className="form__sub-title">Please check your email to get verification OTP</div>
                        <div className="form__input-wrapper otp-wrapper" onPaste={handlePasteOtp}>
                            {otpinput.map((input,index) => {
                                return <input
                                key={index}
                                className="otp_input"
                                type="text"
                                value={otpinput[index]}
                                ref={(input) => (refArray.current[index] = input)}
                                onKeyDown={(e) => handleBackspaceOtp(e,index)}
                                onChange={(e) => handelOnChangeOtp(e.target.value,index)}/>
                            })}
                        </div>
                        <button className="form__submit-btn">Verify</button>
                    </form>
                </section>
            </div>
        </>
    )
}

export default VerifyAccount;
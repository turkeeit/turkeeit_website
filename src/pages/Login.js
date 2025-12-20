import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendOtp, verifyOtp } from "../redux/actions/authActions";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const dispatch = useDispatch();
  const { otpSent, loading, user } = useSelector((state) => state.auth);

  const sendOtpHandler = () => dispatch(sendOtp(phone));
  const verifyOtpHandler = () => dispatch(verifyOtp({ phone, otp }));

  if (user) return <h2>Welcome {user.phone}</h2>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Turkeeit Login</h2>

      {!otpSent ? (
        <>
          <input
            placeholder="Phone"
            onChange={(e) => setPhone(e.target.value)}
          />
          <button onClick={sendOtpHandler} disabled={loading}>
            Send OTP
          </button>
        </>
      ) : (
        <>
          <input
            placeholder="Enter OTP"
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={verifyOtpHandler} disabled={loading}>
            Verify OTP
          </button>
        </>
      )}
    </div>
  );
}

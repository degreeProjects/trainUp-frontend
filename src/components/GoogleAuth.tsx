import { type CredentialResponse, GoogleLogin } from "@react-oauth/google";
import authService from "../services/authService";
import usersService from "../services/userService";
import { useNavigate } from "react-router-dom";

function GoogleAuth() {
  const navigate = useNavigate();

  const onLoginSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      const { request: loginByGoogleRequest } = authService.loginByGoogle(
        credentialResponse.credential!
      );
      const res = (await loginByGoogleRequest).data;

      // Mirror the email/password login flow by persisting both tokens so the
      // interceptor logic continues to work with Google logins.
      document.cookie = `access_token=${res.accessToken}; path=/`;
      document.cookie = `refresh_token=${res.refreshToken}; path=/`;

      await usersService.getMe().request;

      navigate("/");
    } catch (err: any) {
      console.error(err);
    }
  };

  const onLoginError = () => {
    console.error("error while trying to authenticate with google");
  };

  return (
    <GoogleLogin
      onSuccess={onLoginSuccess}
      onError={onLoginError}
      text="signin_with"
      shape="circle"
      width="420"
      locale="en"
    />
  );
}

export default GoogleAuth;

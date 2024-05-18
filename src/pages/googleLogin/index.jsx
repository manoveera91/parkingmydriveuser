import Google from "../../assets/images/google.png";
import { useGoogleLogin } from '@react-oauth/google';
import axios from "axios";

const GoogleLogin = ({ onGoogleResponse }) => {

    const login = useGoogleLogin({
        onSuccess: async (response) => {
            try {
                const res = await axios.get(
                    "https://www.googleapis.com/oauth2/v3/userinfo",
                    {
                        headers: {
                            Authorization: `Bearer ${response.access_token}`,
                        },
                    }
                );
                console.log(res);
                onGoogleResponse(res.data);
            } catch (err) {
                console.log(err);
            }
        }
    });

    return (<a onClick={() => login()}>
        <img src={Google} />
    </a>)
};

export default GoogleLogin;

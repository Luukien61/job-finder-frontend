import {useGoogleOneTapLogin} from 'react-google-one-tap-login';
import {GoogleClientId} from "../info/AppInfo.ts";

export default function useGoogleLogIn() {
        useGoogleOneTapLogin({
        onError: error => console.log(error),
        onSuccess: response  => console.log(response),
        googleAccountConfigs: {
            client_id: GoogleClientId
        },
    });
}
type GoogleResponseOnetap = {
    clientId: string,
    client_id: string,
    credential: string,
    select_by: string
}
export function useGoogleOneTap() {
    const { google } = window;
    google.accounts.id.initialize({
        client_id: GoogleClientId,
        callback: async (response :GoogleResponseOnetap) => {
            console.log(response.credential);
        },
    });
    google.accounts.id.prompt((notification) => {
        // Should handle the notification
        console.log("notification", notification);
    });
}
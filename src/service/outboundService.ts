export type ExchangeRequest = {
    code: string,
    provider: string
}
export type UserInfoResponse={
    name: string,
    email: string,
    id: string,
}
export const exchangeToken = async (provider: string, code: string) => {

    const exchangeRequest: ExchangeRequest = {
        code: code,
        provider: provider
    }
    return await (async () => {
        try {
            const response = await fetch("http://localhost:8090/auth/outbound/exchange_token", {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                method: "POST",
                body: JSON.stringify(exchangeRequest)
            });
            const userInfoResponse: UserInfoResponse = await response.json();
            return userInfoResponse;
        } catch (error) {
            console.log(error);
        }
    })();
}
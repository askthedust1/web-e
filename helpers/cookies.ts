export function clearAllCookies() {
    let cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        let eqPos = cookie.indexOf("=");
        let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }
}

export const getCookie = (nameCookies: string) => {
	const match = document.cookie.split('; ').find((row) => row.startsWith(`${nameCookies}=`));

	return match ? match.split('=')[1] : undefined;
};

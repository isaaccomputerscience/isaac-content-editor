import React, { useEffect } from "react";
import { Spinner } from "reactstrap";
import Cookies from "js-cookie";

import { GITHUB_TOKEN_COOKIE } from "./github";

import styles from "../styles/editor.module.css";
import { getConfig } from "./config";

export function authorizationURL(target: string) {
    const config = getConfig();

    return `https://gitHub.com/login/oauth/authorize?scope=repo&client_id=${config.clientId}&redirect_uri=${encodeURIComponent(target)}`;
}

export async function doAuth(code: string) {
    const config = getConfig();
    const body = {
      clientId: config.clientId,
      code: code,
    }

    const result = await fetch(config.authUrl, {
      method: "POST",
      body: JSON.stringify(body)
    });

    return result.json();
}

export function LoginPrompt() {
    return <div className={`m-5 {styles.centered} {styles.flexFill}`}>
        <h2 className={styles.centered}>Isaac Editor</h2>
        <div className="text-center">
            <a className="btn btn-primary w-25" href={authorizationURL(document.location.href)}>
                Log in
            </a>
        </div>
    </div>;
}

export function LoadingScreen({message = "Logging in..."}: { message?: string }) {
    return <div className={`m-5 text-center {styles.centered} {styles.flexFill}`}>
        <Spinner size="large" />
        <br />
        <h4>{message}</h4>
    </div>;
}

export function Logout() {
    useEffect(() => {
        Cookies.remove(GITHUB_TOKEN_COOKIE);
        window.location.replace("/");
    });
    return <LoadingScreen message="Logging out..."/>;
}

export function Closer() {
    useEffect(() => {
        window.close();
    });
    return <LoadingScreen message="You can now close this window" />;
}

export function isLoggedIn() {
    return Cookies.get(GITHUB_TOKEN_COOKIE) !== undefined;
}

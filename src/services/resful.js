import api from "./base-api";
import axios from "axios";

export default {
    post: (path, body) => {
        return new Promise((resolve, reject) => {
            axios
                .post(
                    api + path, 
                    body, 
                    {
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }
                )
                .then(response => {
                    resolve(response)
                })
                .catch(error => {
                    reject(error.response)
                });
        })

    }
}
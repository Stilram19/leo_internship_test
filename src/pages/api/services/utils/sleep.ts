export default async function sleep(millis: number) {
    new Promise((res, rej) => {
        setTimeout(() => {
            res(true);
        }, millis);
    });
}

export default async function sleep(millis: number) {
    new Promise((res) => {
        setTimeout(() => {
            res(true);
        }, millis);
    });
}

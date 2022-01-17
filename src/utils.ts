export function timeoutPromise(wait:number): Promise<null> {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, wait);
    });
}
export const debounce = (delay, callback) => {

    let debTimeout;
    return function(){
        const context = this;
        const args = arguments;
        clearTimeout(debTimeout);
        debTimeout = setTimeout(
            () => {
                callback.apply(context, args);
            }
        , delay);
    }
}
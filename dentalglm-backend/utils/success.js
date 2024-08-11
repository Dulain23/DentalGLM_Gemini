export const successHandler = (statusCode, message, body = {}) => {
    return {
        statusCode,
        message,
        success: true,
        body
    };
}
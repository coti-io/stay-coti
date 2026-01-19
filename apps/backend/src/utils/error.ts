import { ErrorResp } from '@blazjs/common'

export const Errors = {
    BadRequest: new ErrorResp('error.badRequest', 'Bad request', 400),
    Unauthorized: new ErrorResp('error.unauthorized', 'Unauthorized', 401),
    Forbidden: new ErrorResp('error.forbiden', 'Forbidden', 403),
    Sensitive: new ErrorResp(
        'error.sensitive',
        'An error occurred, please try again later.',
        400,
    ),
    TooManyRequests: new ErrorResp(
        'error.tooManyRequests',
        'Too many requests, please try again later.',
        429,
    ),
    InternalServerError: new ErrorResp(
        'error.internalServerError',
        'Internal server error.',
        500,
    ),
    InvalidSignature: new ErrorResp(
        'error.invalidSignature',
        'Invalid signature',
        401,
    ),
    UserNotFound: new ErrorResp('error.userNotFound', 'User not found', 404),
    DatoCmsServerError: new ErrorResp(
        'error.DatoCmsServerError',
        'DatoCMS server error.',
    ),
    WebhookDataDatoCmsServerError: new ErrorResp(
        'error.WebhookDataDatoCmsServerError',
        'Webhook data from DatoCMS error.',
    ),
    MissingParameter: new ErrorResp(
        'error.missingParameter',
        'Missing parameter',
        400,
    ),
    InsufficientBalance: new ErrorResp(
        'error.insufficientBalance',
        'Insufficient balance',
        400,
    ),
    DatoCmsIdeaNotFoundError: new ErrorResp(
        'error.datoCmsError.IdeaNotFound',
        'DatoCMS: Idea not found.',
    ),
    TransactionNotFound: new ErrorResp(
        'error.transactionNotFound',
        'Transaction not found',
        404,
    ),
    TransactionFailed: new ErrorResp(
        'error.transactionFailed',
        'Transaction failed',
        400,
    ),
    InvalidTransactionDetail: new ErrorResp(
        'error.invalidTransactionDetail',
        'Invalid transaction detail',
        400,
    ),
    DatoCmsUpvotedIdeaError: new ErrorResp(
        'error.datoCmsError.UpvotedIdea',
        'DatoCMS: You cannot upvote your own idea or you have already upvoted.',
    ),
}

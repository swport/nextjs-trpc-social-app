import "@testing-library/jest-dom";

import fetch, { Request, Response, Headers } from "cross-fetch";

global.fetch = fetch;
global.Request = Request;
global.Response = Response;
global.Headers = Headers;

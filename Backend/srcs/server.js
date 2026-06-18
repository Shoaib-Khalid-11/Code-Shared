import ServerlessHttp from "serverless-http";
import app from "./app.js";

if (process.env.NODE_ENV !== "production") {
  const port = 5000;
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}
export default ServerlessHttp(app);

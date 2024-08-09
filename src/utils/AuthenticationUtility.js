export default {
  async fetchAccountInfo(token) {
    const googleProfileUrl =
      "https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=" +
      token;

    var response = await fetch(googleProfileUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    var accountResponse = JSON.parse(await response.text());
    if (accountResponse == undefined || accountResponse["id"] == undefined) {
      return new Response(
        JSON.stringify({ message: "Account not found / token invalid." }),
        {
          status: 403,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    return accountResponse;
  }
}

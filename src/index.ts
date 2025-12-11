import inquirer from "inquirer";

const getCsrfToken = async () => {
  const htmlRes = await fetch('https://www.roblox.com/pt', {
    method: 'GET',
    headers: {
      "Content-Type": "text/html"
    },
  });

  const htmlText = await htmlRes.text();

  const match = htmlText.match(/<meta name="csrf-token" data-token="([^"]+)"/);

  if (match && match[1]) {
    let token = match[1];

    token = token.replace(/&#x2B;/g, '+');

    return token;
  } else {
    throw new Error("Failed to retrieve CSRF token.")
  }
};

async function main() {
  console.log(`
    ██████╗  ██████╗ ██████╗  ██████╗ █████╗ ██████╗  █████╗ 
    ██╔══██╗██╔═══██╗██╔══██╗██╔════╝██╔══██╗██╔══██╗██╔══██╗
    ██████╔╝██║   ██║██████╔╝██║     ███████║██████╔╝███████║
    ██╔═══╝ ██║▄▄ ██║██╔═══╝ ██║     ██╔══██║██╔══██╗██╔══██║
    ██║     ╚██████╔╝██║     ╚██████╗██║  ██║██║  ██║██║  ██║
    ╚═╝      ╚══▀▀═╝ ╚═╝      ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝`);

  const { username } = await inquirer.prompt([{
    name: "username",
    type: "input",
    message: "Enter the username you want to verify on roblox:",
    validate: (input) => input.length >= 3 ? true : "The username must be at least 3 characters long."
  }]);

  console.clear();
  console.log("Please wait a moment...");

  const token = await getCsrfToken();

  if (!token) {
    throw new Error("Token not found, please try again later.");
  }

  const res = await fetch('https://auth.roblox.com/v1/usernames/validate', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Origin": "https://www.roblox.com",
      "x-csrf-token": token
    },
    body: JSON.stringify({
      username,
      birthday: `2000-10-10`
    })
  });

  const data = await res.json();

  console.log(data);
}

await main();
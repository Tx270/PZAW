import user from "../models/user.js";
import session from "../models/session.js";

const SESSION_COOKIE = "__Host-ryba";

export function login_get(req, res) {
  if (res.locals.session?.user_id != null) {
    return res.redirect("/");
  }
  res.render("auth_login", { error: null });
}

export async function login_post(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.render("auth_login", { error: "Username and password are required." });
  }

  const user_id = await user.validatePassword(username, password);

  if (user_id == null) {
    return res.render("auth_login", { error: "Invalid username or password." });
  }

  session.createSession(user_id, res);
  res.redirect("/");
}

export function signup_get(req, res) {
  if (res.locals.session?.user_id != null) {
    return res.redirect("/");
  }
  res.render("auth_signup", { error: null });
}

export async function signup_post(req, res) {
  const { username, password, password_confirm } = req.body;

  if (!username || !password || !password_confirm) {
    return res.render("auth_signup", { error: "All fields are required." });
  }

  if (password !== password_confirm) {
    return res.render("auth_signup", { error: "Passwords do not match." });
  }

  const usernameRegex = /^[a-zA-Z0-9]+$/;
  if (username.length < 3 || username.length > 20 || !usernameRegex.test(username)) {
    return res.render("auth_signup", { error: "Username must be 3-20 alphanumeric characters." });
  }

  if (password.length < 8 || password.length > 100) {
    return res.render("auth_signup", { error: "Password must be 8-100 characters." });
  }

  const new_user = await user.createUser(username, password);

  if (new_user == null) {
    return res.render("auth_signup", { error: "Username is already taken." });
  }

  session.createSession(new_user.user_id, res);
  res.redirect("/");
}

export function logout(req, res) {
  const sessionId = req.cookies[SESSION_COOKIE];
  if (sessionId) {
    session.deleteSession(sessionId);
  }
  res.cookie(SESSION_COOKIE, "", { maxAge: 0, httpOnly: true, secure: true });
  res.redirect("/auth/login");
}

export default { login_get, login_post, signup_get, signup_post, logout };

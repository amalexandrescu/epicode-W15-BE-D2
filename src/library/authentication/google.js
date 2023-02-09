import GoogleStrategy from "passport-google-oauth20";
import AuthorsModel from "../../api/authors/model.js";
import { createAccessToken } from "./tools.js";

const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: `${process.env.BE_URL}/authors/googleRedirect`,
  },
  async (_, __, profile, passportNext) => {
    // This function is executed when Google sends us a successfull response
    // Here we are going to receive some informations about the user from Google (scopes --> profile, email)

    try {
      console.log(profile);
      const { email, given_name, family_name } = profile._json;

      // 1. Check if the author is already in db
      const author = AuthorsModel.findOne({ email });

      if (author) {
        // 2. If he is there --> generate an accessToken (optionally a refresh token)
        const payload = { _id: author._id, role: author.role };
        const accessToken = await createAccessToken(payload);

        // 2.1 Then we can go next (to /googleRedirect route handler function), passing the token
        passportNext(null, { accessToken });
        //null means no errors
      } else {
        // 3. If the author is not in our db --> create that
        const newAuthor = new AuthorsModel({
          name: given_name,
          surname: family_name,
          email: email,
          googleId: profile.id,
        });

        const createdAuthor = await newAuthor.save();

        // 3.1 Then generate an accessToken (optionally a refresh token)
        const accessToken = await createAccessToken({
          _id: createdAuthor._id,
          role: createdAuthor.role,
        });

        // 3.2 Then we can go next (to /googleRedirect route handler function), passing the token
        passportNext(null, { accessToken });
      }
    } catch (error) {
      console.log(error);
      passportNext(error);
    }
  }
);

export default googleStrategy;

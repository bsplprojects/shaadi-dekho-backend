import crypto from "crypto";
import axios from "axios";

export const generateOtp = () => {
  return crypto.randomInt(100000, 999999);
};

export const hashOtp = (otp) => {
  return crypto.createHash("sha256").update(otp.toString()).digest("hex");
};

export const sendSMS = async (mob, otp) => {
  try {
    const message = encodeURIComponent(
      `Your Login OTP is : ${otp}. Note: Please DO NOT SHARE this OTP with anyone. Team Zivaan By Buck Softech`,
    );

    let url =
      "http://144.76.184.187/http-tokenkeyapi.php?authentic-key=37347a697661616e3130301771502075&senderid=ZIVAAN&route=1&number=" +
      mob +
      "&message=Your Login OTP is : " +
      otp +
      ". Note: Please DO NOT SHARE this OTP with anyone. Team Zivaan By Buck Softech&templateid=1207177150033639915";

    const response = await axios.get(url);

    return response.data;
  } catch (error) {
    console.error("SMS Error:", error.message);
  }
};

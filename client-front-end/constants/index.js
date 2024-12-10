import withdraw from "../assets/withdraw.svg"
import createcampaign from "../assets/createcampaign.svg"
import dashboard from "../assets/dashboard.svg"
import logout from "../assets/logout.svg"
import payment from "../assets/payment.svg"
import profile from "../assets/profile.svg"

export const navlinks = [
    {
        name: "dashboard",
        imgUrl: dashboard,
        link: "/",
    },
    {
        name: "campaign",
        imgUrl: createcampaign,
        link: "/create-campaign",
    },
    {
        name: "payment",
        imgUrl: payment,
        link: "/",
        disabled: true,
    },
    {
        name: "withdraw",
        imgUrl: withdraw,
        link: "/",
        disabled: true,
    },
    {
        name: "profile",
        imgUrl: profile,
        link: "/profile",
    },
    {
        name: "logout",
        imgUrl: logout,
        link: "/",
        disabled: true,
    },
]

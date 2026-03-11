export interface Plan{
        name:string,
        amount:number,
        currency:string,
        interval:string,
        isPopular?:boolean,
        description:string,
        features:string[],
}

export const availablePlans:Plan[]=[
        {name:"Weekly plan",
        amount:9.99,
        currency:"USD",
        interval:"week",
        description:"Great if you want to try the service before committing longer",
        features:[
                "Unlimited AI meal plans",
                "AI nutiration insight",
                "Cancel Anytime"
        ],
       },
       {name:"Monthly plan",
        amount:49.99,
        currency:"USD",
        interval:"month",
        isPopular:true,
        description:"Great if you want to try the service before committing longer",
        features:[
                "Unlimited AI meal plans",
                "AI nutiration insight",
                "Cancel Anytime"
        ],
       },
       {name:"Yearly plan",
        amount:499.99,
        currency:"USD",
        interval:"year",
        description:"Great if you want to try the service before committing longer",
        features:[
                "Unlimited AI meal plans",
                "AI nutiration insight",
                "Cancel Anytime"
        ],
       },      
]
 const PriceIDMap:Record<string,string>={
        week:process.env.STRIPE_PRICE_WEEKLY!,
        month:process.env.STRIPE_PRICE_MONTHLY!,
        year:process.env.STRIPE_PRICE_YEARLY!,
 }
export const getPriceIDFromType=(planType:string)=>PriceIDMap[planType]
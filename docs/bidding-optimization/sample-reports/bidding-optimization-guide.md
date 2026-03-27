# Bidding Optimization Guide

## Intro

- In this guide, we'll review our bidding optimization process, one of the most important reports in the system.

- In an ideal world, **to generate the best results for our PPC campaigns**, we would manually review every campaign, analyze everything, and make decisions for every target in every campaign.

- Unfortunately, when managing hundreds of campaigns, this is not practical and would require too much time.

- Therefore, we created our Bid Optimization System to replicate the manual actions we would have taken as closely as possible, but in a **much more efficient way**.

- There are many different bidding optimization solutions in the marketplace, and everyone likes to do it their own way. After testing many different methods — some more automatic and some less, some more based on math calculations and some less — I've found that this system works the best: it generates the best results for the least amount of time.

## Semi-Automatic System

- The process is built with a **"semi-automatic" approach;** you have rules you can apply to every campaign. These rules copy manual actions, but instead of implementing them yourself, you **click a button** on the report, and the **VA implements the changes**.

- This method provides **maximum control** and the **highest chance for campaigns to perform at their best**, as you're going to personally check them every week, see what happened from the last 7 and 30 days, and optimize accordingly.

- In other words, the system keeps the **benefits of manually reviewing every campaign** while making it **significantly more efficient** (just a few hours per week).

- For example, for all your profit campaigns, which make up most of your campaigns, the goal is simple:
  - Analyze how the campaign performed over the last 7 and 30 days, and apply rules to **navigate** the campaign toward the **desired results**.
    - If ACOS is high, apply rules that will lower it.
    - If ACOS is low, apply rules that will increase sales velocity.
    - If ACOS and spending are good, apply small optimizations or make no changes.

- This report is the longest process in the system but also the most important to master. The better your weekly decisions, the better your PPC performance and profitability will be.

### Process Overview

| Section | Details |
|---------|---------|
| **Purpose** | Optimize **targets' bids** to improve campaign performance with minimal risk, based on the **last 30 and 7 days performance**. |
| **Process** | Step 1: **VA** — Fill the Optimization Bidding Sheet with data for all campaigns from the last 7 and 30 days. |
| | Step 2: **Operator** — Analyze the data in the table. Things like: ACOS trend and absolute ACOS vs break-even ACOS. Recent daily spend vs campaign budget. |
| | Step 3: **Operator** — Apply rules/processes to the campaigns. Things like: Increase bids for high-performing targets. Decrease bids for underperforming targets. Increase bids for targets with little or no clicks. Add decisions to the sheet. |
| | Step 4: **VA** — Open all campaigns in Campaign Manager and implement the operator's decisions for each campaign. |
| **Outcome** | Improve PPC performance by spending more on high-performing targets and less on underperforming ones. Improve **ACOS** and **TACoS**. |
| **Cadence** | **Weekly**. |

### Definitions

- **KW** = Keyword.
- **Target** = A KW we are bidding on in a PPC campaign.
- **Converted target** = A KW with at least 1 sale.
- **SP** = Sponsored Products
- **SB** = Sponsored Brands
- **SBV** = Sponsored Brands Video
- **SD** = Sponsored Display

## Make Optimization Decisions

Now that the sheet is ready, your task is as follows:

1. **Start by reviewing the top spending campaigns of your best selling product.**
   - Sort the table by Spend (Last 30 days) and then Sort the table by portfolio.
   - Begin with the campaigns for your best-selling product, then move on to the second best-selling product, and so on, until you finish with your lowest-selling product.
   - For the **80/20 campaigns** in your portfolio — If needed, manually review them before making a decision. Make the best decisions for them.

2. **Continue by reviewing the remaining campaigns**
   - Go through the rest of the campaigns, one by one.
   - If a campaign isn't spending much money (check **Spend Yesterday**), review the data quickly and make a decision.
     - The more a campaign spends, the more time you should invest in it.
     - The downside risk is minimal for these smaller campaigns so don't spend too much time on those.

3. **Finalize your optimization**
   - After reviewing each campaign, apply the rules you want the VA to implement to optimize the campaign.

4. **Send the report**
   - Share the completed report with your VA and instruct them to implement the changes.

---

## The Rules

- The rules are your tools to **guide your campaigns in the direction you want them to go.** In the following part of the guide we'll give a breakdown on every rule.

- As we said, the system was designed to closely mimic the actions we would take if we were reviewing and optimizing the campaign manually — Therefore, the rules cover everything you would have done if you were manually analyzing and optimizing the campaign.

- The sheet and optimization are rule-based, with six rules that the VA will implement for you:
  1. **Lower bids for Bleeders w/ no Sales** — To reduce the bids or pause any target with a lot of clicks and no sale.
  2. **Lower bids for targets w/ ACOS higher than** — Reduce the bids for any target with sales but high ACOS.
  3. **Increase bids to Targets w/ Low Clicks** — Increase the bids for any target with 1 click or less in the last 30 days.
  4. **Increase bids for Targets with good ACOS** — Increase the bids for targets with good ACOS.
     - **Criteria: Good ACOS = ACOS lower than?** — Conditional Rule to set the ACOS threshold.
  5. **Change Campaign Budget** — New budget for the campaign.
  6. **Pause Campaign** — Mark to pause the campaign.

- Using those rules you'll be able to navigate your campaigns towards their goals:
  1. If you want to lower your ACOS and TACOS, you'll want to use the two rules that lower bids, and increase slightly targets that convert very well.
  2. If you're trying to increase sales velocity, you'll want to increase the bids for all the good targets, and to targets that didn't get many clicks.
  3. If your campaign is getting out of budget and has good ACOS → You'll want to increase your budget.
  4. If your campaign is getting out of budget but has bad ACOS → You'll want to decrease all/most of your bids.

### Lower bids for Bleeders w/ no Sales

This rule reduces bids for non-converting targets.

**How It Works:**
- To apply the rule, tick the box and the VA will apply the following:
  - Targets with **6-7 clicks and no orders** in the last 30 days: Reduce the bid by 5%.
  - Targets with **8-14 clicks and no orders** in the last 30 days: Reduce the bid by 10%.
  - Targets with more than **14 clicks and no orders** in the last 30 days: Pause the target.

**Explanation:**
Targets with many clicks but no sales are likely bleeders. Lowering their bids or pausing them makes sense.

**Notes:**
- If your product's conversion rate is below 10%, adjust the thresholds in the Rules tab and notify your VA.
- This rule has low downside and can potentially be implemented on all the campaigns, as it affects only targets with 0 sales.

### Lower bids for targets w/ ACOS higher than

This rule reduces bids for converted targets (Targets that got at least 1 sale in the last 30 days).

**How It Works:**
- To apply the rule, fill in the **Minimum ACOS column** with an ACOS percentage.
- The VA will reduce the bid for any target with a higher ACOS in the last 30 days than the ACOS in the column.
- He'll calculate the difference between the target's ACOS in the last 30 days and the ACOS in the column and will reduce the bid by the delta.
  - For example: Minimum ACOS: **40%**
    - Target with **58% ACOS**: Lower bid by **18%** (58 - 40 = 18).
    - Target with **49% ACOS**: Lower bid by **9%** (49 - 40 = 9).
    - Target with **44% ACOS**: Lower bid by **4%** (44 - 40 = 4).

**Explanation:**
This rule helps lower the average ACOS of the campaign by reducing bids on high-ACOS targets. For example:
- If your campaign has an average ACOS of **39%** and you set a **40% Minimum ACOS**, the VA will identify targets above 40%.
  - A target with **44% ACOS** (close to the average) will see a small decrease of **4%** to avoid aggressive changes.
  - A target with **60% ACOS** (well above the average) will see a larger decrease of **20%** to bring it closer to the campaign's goals.

This targeted approach ensures bids are adjusted based on performance, helping campaigns move toward their desired ACOS.

### Increase bids to Targets w/ Low Clicks

This rule increases bids for targets with **1 or fewer clicks** in the last 30 days.

**How It Works:**
- To apply the rule, fill in the **Low Clicks column** with a percentage.
- The VA will increase the bids for all targets with 1 or fewer clicks in the last 30 days by this percentage.
  - For example, you mark 10% in the column.
    - The VA will filter the campaign to see only targets with 1 or fewer clicks in the last 30 days.
    - Then he'll Increase their bids by **10%**.

**Explanation:**
To lower your ACOS in the long term, you want to constantly test new targets. In many of your campaigns, you'll have many targets that are not getting impressions. This rule gradually increases bids to improve impressions for low-click targets.

### Increase bids for Targets with good ACOS + Criteria: Good ACOS = ACOS lower than?

This rule increases bids for converted targets with a good ACOS.

**How It Works:**
- To apply the rule, fill in the **Converted Targets column** with a percentage increase.
- Then, fill in the **Maximum ACOS column** with the maximum ACOS that is considered to be good for this campaign.
- Now, the VA will filter to see only targets with an ACOS lower than the Maximum ACOS you wrote, in the last 30 days.
- Then, he'll Increase their bids by the percentage you noted.

**Explanation:**
When optimizing your campaigns, you want to spend more on good targets and less on bad targets. Using this rule you'll increase the bids of your good targets so you'll get more impressions there. But, every campaign is different, so define the good ACOS threshold for each campaign. Only targets below this threshold will have their bids increased.

- For example:
  - You mark a 10% bid increase in the first column.
  - You mark Maximum ACOS of **24%** in the second column.
  - The VA will go to the campaign and do the following:
    - Filter to see only the targets with an ACOS lower than **24%** in the last 30 days.
    - Increase all their bids by **10%**.

### Change Campaign Budget

Change the campaign's budget to the new value specified in this column.

**Example:**
- Budget: **$25**
  - Find the campaign and change its budget to **$25**, regardless of its previous budget.

### Pause Campaign

Pause the campaign when the Pause Campaign box is checked.

**Example:**
- If you tick the "Pause Campaign" box, the campaign will be paused.

---

## Key Principles

### Does the campaign help our organic rank?

- SP campaigns play a key role in driving and maintaining high organic rankings for your products. These campaigns, especially those with high sales volume and good conversion rates, have a significant impact on improving your organic rank.

- Over time, SP campaigns can help you win more organic rank across new keywords, making them more valuable than SB / SBV / SD campaigns.

- Because of their long-term value, SP campaigns should be treated differently.
  - Invest more time in optimizing them, find more ways to improve their performance, and give them more chances to succeed.
  - Allow higher ACOS for SP campaigns and give them more 'second chances'.

### Is the campaign under target ACOS?

The performance of a campaign is measured against its **Target ACOS**. For all profit campaigns, the goal is to achieve the most sales with the lowest ACOS.

When a campaign is performing well (**ACOS < Target ACOS**), you have two options:

1. **Avoid unnecessary changes:**
   - Let the campaign run as is.
   - Any change introduces risk. Not making changes ensures consistent performance and another good week from this campaign.

2. **Try to increase spend while keeping ACOS relatively healthy:**
   - To increase spend, you'll need to increase bids. Higher bids can result in increased spend but may also raise ACOS.
   - Consider: *Do I want to increase spend if I know the ACOS will rise?*
     - If the campaign's ACOS in the last 7 and 30 days is **23% or less**, increase bids and spend. Even if ACOS rises to **26-29%**, it is still excellent performance.
     - If the campaign's ACOS in the last 7 and 30 days is 29%, increasing bids may result in the ACOS climbing to 35%. Is this something you want? If yes, make the change. If not, skip it.

**If you decide to increase spend:**
- Focus on increasing bids for targets with good ACOS and for targets with little clicks.
- Make small incremental adjustments each week.
- Ensure the campaign's budget is high enough to allow for additional spend.

### Is the campaign over target ACOS?

When a campaign is underperforming (**ACOS > Target ACOS**):

- If the campaign's ACOS is close to your break-even ACOS, apply all rules to try to bring it back and get it back on track:
- Use both **Bleeders Rules**:
  - Lower bids for all terms with high clicks and no orders.
  - Lower bids for any target with an ACOS higher than the campaign's average ACOS.
- **Increase bids for good targets:**
  - Focus on targets with very good ACOS compared to the campaign average.
    - *Example:* In a campaign with **39% ACOS**, increase bids for targets with **27% ACOS or less** to allocate more spend to these.
- **Increase bids for targets with no clicks:**
  - Ensure new targets are tested by increasing their bids.
- When increasing bids, make small incremental adjustments. Keep in mind that you're trying to lower the campaign's ACOS.

### Is the campaign well over target ACOS?

When a campaign has a **very high ACOS**, far from the Target ACOS (20% higher or more), you have two options:

1. **Pause the campaign:**
   - If repeated optimizations over several weeks have failed, pause the campaign and move its budget to a better one.

2. **Take aggressive actions:**
   - If you want to give the campaign a second chance, make aggressive changes. These changes may either dramatically improve performance or confirm that the campaign won't work.

**Aggressive actions ideas:**
- **Increase bids:** Raise bids for Good ACOS targets and Low Clicks targets by **25%**.
- **Lower bids:** Reduce bids for high ACOS targets by **25-30%**.
- **Pause underperforming targets:** Pause all targets in the campaign except those performing well.

### Is the Campaign Trend Positive or Negative?

When deciding which rules to apply, check the performance over the last 30 days compared to the last 7 days to determine the campaign trend.

- **Positive Trend (ACOS last 7 days < ACOS last 30 days):**
  - Minimize changes and let time work in your favor.
  - Monitor the campaign to ensure the trend continues in the right direction.
  - You want the performance from the last 7 days to become consistent with the last 30 days.

- **Negative Trend (ACOS last 7 days > ACOS last 30 days):**
  - This is a bad sign, so apply more optimization rules to try to reverse the trend.

If the swing is more than 5%, you can assume it's a trend and act accordingly. If it's less, it's normal and not meaningful, so continue optimizing as usual.

### Is the Campaign Spending Its Budget?

Another important factor to check is how much the campaign spent yesterday and the day before yesterday compared to its budget. You'll see a warning if your campaign is spending amounts close to its budget.

- **When the campaign is spending close to its budget:**
  - Avoid increasing bids, as this will cause the campaign to go out of budget faster without improving results.
  - If the campaign is performing well (or trending positively), increase the budget.
  - If the campaign is underperforming (or trending negatively), lower bids instead.

- **When the campaign is far from its budget:**
  - Continue optimizing normally.

---

## Reminders

### The 80/20 Rule

- Remember, the 80/20 rule applies to your account's PPC.
- 20% of your campaigns drive 80% of the results. Focus your attention on these high-impact campaigns.
- Avoid processes that might negatively affect these campaigns and minimize risk.
- For these key campaigns, it's often best to manually review them as part of the process, make decisions, and implement changes on the spot.
- Invest most of your attention in these campaigns and aim to make thoughtful, low-risk decisions. This will significantly improve your PPC performance.

### When to Avoid Changes

- If a campaign is spending a high amount and the ACOS is within a normal range, it's often best to leave it as is.
- Don't make changes for the sake of making changes. As long as ACOS and spend are as expected, let the campaign run.
- The process allows you to frequently check your primary campaigns, so if they start underperforming, you'll be able to respond quickly.

### Manual Work

- If you're unsure how to optimize a campaign, go into it manually and take a quick look.
- Aim for decisions that carry the lowest downside risk.
- It's perfectly fine to defer optimizing the campaign to the next time you run the process.

### Placement Bids

- Keep in mind that all campaigns have placement bids.
- This is why making frequent, small changes is beneficial — many small positive adjustments will lead to better overall PPC performance.
- Some campaigns rely heavily on strong placement bids. Be aware of which campaigns these are through your work with the placement optimization process.

By applying these principles, you can ensure that your PPC strategies are effective, targeted, and optimized for long-term success.

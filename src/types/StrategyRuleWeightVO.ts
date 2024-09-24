export interface StrategyRuleWeightVO {
    ruleWeightCount: number;
    userActivityAccountTotalUseCount: number;
    strategyAwardList: StrategyAward[];
}

export interface StrategyAward {
    // 奖品ID
    awardId: number;
    // 奖品标题
    awardTitle: string;
}
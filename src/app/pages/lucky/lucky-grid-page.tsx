"use client"

import React, {useEffect, useState, useRef} from 'react'
// @ts-ignore
import {LuckyGrid} from '@lucky-canvas/react'

import {queryRaffleAwardList, randomRaffle} from '@/apis'
import {RaffleAwardVO} from "@/types/RaffleAwardVO";

/**
 * 大转盘文档：https://100px.net/docs/grid.html
 * @constructor
 */
export function LuckyGridPage() {
    const [prizes, setPrizes] = useState([{}])
    const myLucky = useRef()

    // 背景
    const [blocks] = useState([
        {padding: '10px', background: '#869cfa'}
    ])

    const [buttons] = useState([
        {x: 1, y: 1, background: "#7f95d1", fonts: [{text: '开始', top: '35%'}]}
    ])

    const [defaultStyle] = useState([{background: "#b8c5f2"}])

    // 查询奖品列表
    const queryRaffleAwardListHandle = async () => {
        const queryParams = new URLSearchParams(window.location.search);
        const strategyId = Number(queryParams.get('strategyId'));
        const result = await queryRaffleAwardList(strategyId);
        const {code, info, data} = await result.json();
        if (code != "0000") {
            window.alert("获取抽奖奖品列表失败 code:" + code + " info:" + info)
            return;
        }

        // 创建一个新的奖品数组
        const prizes = [
            {x: 0, y: 0, fonts: [{id: data[0].awardId, text: data[0].awardTitle, top: '35%'}]},
            {x: 1, y: 0, fonts: [{id: data[1].awardId, text: data[1].awardTitle, top: '35%'}]},
            {x: 2, y: 0, fonts: [{id: data[2].awardId, text: data[2].awardTitle, top: '35%'}]},
            {x: 2, y: 1, fonts: [{id: data[3].awardId, text: data[3].awardTitle, top: '35%'}]},
            {x: 2, y: 2, fonts: [{id: data[4].awardId, text: data[4].awardTitle, top: '35%'}]},
            {x: 1, y: 2, fonts: [{id: data[5].awardId, text: data[5].awardTitle, top: '35%'}]},
            {x: 0, y: 2, fonts: [{id: data[6].awardId, text: data[6].awardTitle, top: '35%'}]},
            {x: 0, y: 1, fonts: [{id: data[7].awardId, text: data[7].awardTitle, top: '35%'}]},
        ]

        // 设置奖品数据
        setPrizes(prizes)
    }

    // 调用随机抽奖
    const randomRaffleHandle = async () => {
        const queryParams = new URLSearchParams(window.location.search);
        const strategyId = Number(queryParams.get('strategyId'));
        const result = await randomRaffle(strategyId);
        const {code, info, data} = await result.json();
        if (code != "0000") {
            window.alert("获取抽奖奖品列表失败 code:" + code + " info:" + info)
            return;
        }
        // 为了方便测试，mock 的接口直接返回 awardIndex 也就是奖品列表中第几个奖品。
        return data.awardIndex - 1;
    }

    useEffect(() => {
        queryRaffleAwardListHandle().then(r => {
        });
    }, [])

    return <>
        <LuckyGrid
            ref={myLucky}
            width="300px"
            height="300px"
            rows="3"
            cols="3"
            blocks={blocks}
            prizes={prizes}
            defaultStyle={defaultStyle}
            buttons={buttons}
            onStart={() => { // 点击抽奖按钮会触发star回调
                // @ts-ignore
                myLucky.current.play()
                setTimeout(() => {
                    // 抽奖接口
                    randomRaffleHandle().then(prizeIndex => {
                        // @ts-ignore
                        myLucky.current.stop(prizeIndex);
                    }
                );
                }, 2500)
            }}
            onEnd={
                // @ts-ignore
                prize => {
                    alert('恭喜你抽到【' + prize.fonts[0].text + '】奖品ID【' + prize.fonts[0].id + '】')
                }
            }>

        </LuckyGrid>
    </>

}
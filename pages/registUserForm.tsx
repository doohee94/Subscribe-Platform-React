import { Radio, TextField } from '@material-ui/core';
import Router from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import Button from '../components/common/Button';
import { checkEmailDupl, signUp } from '../src/lib/api/user';

const registUserForm = () => {

    // 회원유형
    const [registType, setRegistType] = useState("member");

    // 회원유형 변경 함수
    const changeType = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        // 회원정보 초기화
        setUserInfo({
            ...userInfo,
            email : "",
            password : "",
            userName : "",
            ownerName : "",
            storeName : "",
            businessNum1 : "",
            businessNum2 : "",
            businessNum3 : ""
        });

        setRegistType(e.target.value);
    },[registType]);

    // 회원정보
    const [userInfo, setUserInfo] = useState({
        email:"",
        password:"",
        userName:"",
        ownerName:"",
        storeName:"",
        businessNum1: "",
        businessNum2:"",
        businessNum3:"",
    });
    // 회원정보 변경 함수
    const changeInfo = (e:React.ChangeEvent<HTMLInputElement>) => {

        // 사업자번호는 숫자만 가능
        if(e.target.name === "businessNum1" || e.target.name === "businessNum2" || e.target.name === "businessNum3") {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
        } ;
        
        setUserInfo({
            ...userInfo,
            [e.target.name] : e.target.value
        });
    }

    // 이메일 중복확인 변수
    const [chkEmail, setChkEmail] = useState(false);

    // 이메일 중복확인 함수
    const checkDuplEmail = (e:Event) => {
        e.preventDefault();
        if(userInfo.email.trim() == ""){
            alert("이메일을 입력해주세요.");
            return false;
        }

        // 이메일 중복체크 서버 갔다오기
        checkEmailDupl(userInfo.email)
            .then(response => {
                if(response.data.result === null){
                    setChkEmail(true);
                    alert("사용가능한 이메일입니다.");
                }else{
                    alert("이미 등록된 이메일입니다.");
                }
            })
            .catch(e => {
                alert("오류가 발생했습니다. 다시 시도해주세요."); 
                console.log(e);
            })
    }

    // 이메일 변경될 때마다 중복체크 다시하기
    useEffect(() => {
        setChkEmail(false);
    },[userInfo.email])

    // 회원가입 함수
    const registUser = () => {
        // 유효성 체크
        // 1. 이메일 중복체크여부
        if(!chkEmail){
            alert("이메일 중복체크를 해주세요.");
            return false;
        }

        // 회원가입
        signUp(userInfo)
        .then(res => {
            
        })
        .catch(e => {
            alert("오류가 발생했습니다. 다시 시도해주세요."); 
            console.log(e);
        })
    }

    return (
        <div>
            <div>
            <label>일반회원</label>
            <Radio
                checked={registType === 'member'}
                onChange={changeType}
                value="member"
                color="default"
                name="registType"
                inputProps={{ 'aria-label': 'member' }}
            />
            <label>판매자</label>
            <Radio
                checked={registType === 'store'}
                onChange={changeType}
                value="store"
                color="default"
                name="registType"
                inputProps={{ 'aria-label': 'store' }}
            />
            </div>
            {/* 일반회원 판매자 공통 */}
            <TextField label="이메일" name="email" onChange={changeInfo} value={userInfo.email}/><Button onClick={checkDuplEmail}>중복확인</Button><br/>
            <TextField type="password" label="비밀번호" name="password" onChange={changeInfo} value={userInfo.password}/><br/>
            {registType === "member" ? (    // 일반 회원 회원가입
                <div><TextField label="이름" name="userName" onChange={changeInfo} value={userInfo.userName}/></div>
            ):( // 판매자 회원가입
                <div>
                    <TextField label="사업자명" name="ownerName" onChange={changeInfo} value={userInfo.ownerName}/><br/>
                    <TextField label="상호명" name="storeName" onChange={changeInfo} value={userInfo.storeName}/>
                    <div>
                    <TextField label="사업자번호" name="businessNum1" onChange={changeInfo} value={userInfo.businessNum1}/> - <TextField label="사업자번호" name="businessNum2" onChange={changeInfo} value={userInfo.businessNum2}/> - <TextField label="사업자번호" name="businessNum3" onChange={changeInfo} value={userInfo.businessNum3}/>
                    </div>
                </div>
            )}
            <br/>
            <Button onClick={registUser}>가입하기</Button>
            <Button onClick={() => Router.back()}>취소</Button>
        </div>
    );
};

export default registUserForm;
import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    /* align-items: center; */
    justify-content: center;
    flex-direction: column;
    padding: 4rem 3vw;
    width: 100%;
`;

export const Section = styled.section`
    margin : 1vw;
    height: 100%;
    width: ${props => props.width};
`;

export const Form = styled.form`
    display: flex;
    flex-direction: column;
    label{
        input{
            margin-left: 0.5rem;
        }
        font-size: 1rem;
        margin-bottom: 0.5rem;
    }
    margin-bottom: 2rem;
`

export const Row = styled.div`
    display: flex;
    align-items: center;
    /* justify-content: center; */
    flex-direction: row;
    height: 100%;
    width: 100%;
`

export const Menu = styled.header`
    display: flex;
    width: 100%;
    justify-content: space-evenly;
    align-items: center;
    flex-direction: row;
    border-bottom: 1px solid lightgrey;
    margin-bottom: 2rem;
`

export const MenuItem = styled.button`
    display: flex;
    width: 100%;
    text-align: center;
    border: none;
    background-color: transparent;
    padding: 1rem 0.5rem;
    font-size: 1.15rem;
    background-color: ${props => props.active ? "#e6e4ed" : "transparent"};
    &:hover{
        transition: ease-in-out 0.2s;
        background-color: #e6e4ed;
    }
`

export const Button = styled.button`
    display: flex;
    text-align: center;
    outline: ${props => props.active ? "2px solid rgb(30, 180, 150)" : "none"};
    border: none;
    background-color: ${props => props.color ? props.color : "rgb(35, 198, 168)"};
    color: white;
    padding: 0.5rem 0.5rem;
    border-radius: 2px;
    &:hover{
        transition: ease-in-out 0.2s;
        background-color: ${props => props.color ? props.color : "rgb(32, 186, 158)"};
        filter: brightness(80%);
        color: white;
    }
    margin-bottom: 0.5rem;
    margin-top: 0.5rem;
`;

export const Table = styled.table`
    width: 100%;
    th{
        background-color: #e6e4ed;
        font-weight: 500;
        font-size: 1rem;
        padding: 0.5rem 0.5rem;
    }
    td {
        padding: 0.2rem 0.2rem;
        text-align: center;
        background-color: #eee9f2;
    }
`;

export const SubmitButton = styled.button`
    text-align: center;
    width: 30%;
    border: none;
    background-color: rgb(35, 198, 168);
    color: white;
    padding: 0.5rem 0.5rem;
    border-radius: 2px;
    &:hover{
        transition: ease-in-out 0.2s;
        background-color: rgb(32, 186, 158);
        color: white;
    }
    margin-bottom: 1rem;
    margin-top: 1rem;
`;
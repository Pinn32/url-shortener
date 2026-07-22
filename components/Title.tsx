import styled from "styled-components";

const StyledTitle = styled.section`
    width: min(900px, 100%);
    margin: 0 auto;
    padding: 0.75rem 1.25rem 0;
    text-align: center;

    & h1 {
        font-size: 3rem;
        line-height: 1.15;
    }

    & h2 {
        margin-top: 0.65rem;
        font-size: 1.15rem;
        font-weight: 400;
        line-height: 1.5;
    }
    
    @media screen and (max-width: 800px) {
        padding: 0.25rem 0.5rem 0;

        & h1 {
            font-size: 2.1rem;
        }

        & h2 {
            margin-top: 0.4rem;
            font-size: 0.95rem;
            line-height: 1.4;
        }
    }

    @media screen and (max-width: 420px) {
        & h1 { font-size: 1.85rem; }
        & h2 { font-size: 0.9rem; }
    }
`;

export default function Title() {
    return(
        <StyledTitle id="title">
            <h1>URL Shortener</h1>
            <h2>This website helps you to compact your long URLs into shareable short links.</h2>
        </StyledTitle>
    )
}

import { useState } from "react";
import styled from "styled-components";

const StyledDiv = styled.div`
    background-color: var(--dark-green);
    margin: 0 auto;
    border-radius: 8px;
    width: min(900px, 100%);
    padding: 1.25rem 1.5rem 1.5rem;

    @media screen and (max-width: 800px) {
        width: 100%;
        padding: 1rem;
    }
`;

const UrlRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
`;

const CopyButton = styled.button`
    flex-shrink: 0;
    height: 2.25rem;
    min-height: 2.25rem;
    padding: 0 1.15rem;
    font-size: 1rem;
    background-color: var(--color);
    color: var(--dark-green);
    border: none;
    border-radius: 4px;
    cursor: pointer;
    &:hover {
        background-color: var(--light-green);
    }
    &:active {
        background-color: seagreen;
    }
`;

const OutputText = styled.p`
    flex: 1;
    min-width: 0;
    color: var(--light-green);
    overflow-wrap: anywhere;
`;

const OutputLabel = styled.span`
    color: var(--color);
`;

type Result =
    | { type: "success"; url: string; warning?: string }
    | { type: "error"; message: string };

export default function Output({ result }: { result: Result }) {
    const [copied, setCopied] = useState(false);

    async function handleCopy() {
        if (result.type !== "success") return;
        await navigator.clipboard.writeText(result.url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return(
        <StyledDiv>
            {
                result.type === "success"
                    ?
                (<>
                    {result.warning && <p style={{ color: "var(--light-green)", fontStyle: "italic", marginBottom: "0.5rem" }}>{result.warning}</p>}
                    <UrlRow>
                        <OutputText>
                            <OutputLabel>Your compacted URL:</OutputLabel> {result.url}
                        </OutputText>
                        <CopyButton onClick={handleCopy}>{copied ? "Copied!" : "Copy"}</CopyButton>
                    </UrlRow>
                </>)
                    :
                (<p>{result.message}</p>)
            }
        </StyledDiv>
    )
}

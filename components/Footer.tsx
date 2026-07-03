import styled from "styled-components";

const StyledFooter = styled.footer`
    color: #90bc8f;
    font-size: 0.75rem;
    margin: auto 0;
`;

export default function Footer() {
    return (
        <StyledFooter>
            © {new Date().getFullYear()} <a href="https://github.com/Pinn32" target="_blank" rel="noopener noreferrer">Pinn Xu</a>. All rights reserved.
        </StyledFooter>
    )
}

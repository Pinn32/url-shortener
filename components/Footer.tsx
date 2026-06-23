import styled from "styled-components";

const StyledFooter = styled.footer`
    color: #90bc8f;
    font-size: 0.75rem;
    margin: auto 0;
`;

export default function Footer() {
    return (
        <StyledFooter>
            © {new Date().getFullYear()} Pinn Xu. All rights reserved.
        </StyledFooter>
    )
}

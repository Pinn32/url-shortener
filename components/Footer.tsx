import styled from "styled-components";

const StyledFooter = styled.footer`
    color: #90bc8f;
    font-size: 0.75rem;
    margin: auto 0;

    @media (max-width: 768px) {
        margin: 2rem 0;
    }
`;

export default function Footer() {
    const startYear = 2026;
    const currentYear = new Date().getFullYear();

    return (
        <StyledFooter>
            © {
                currentYear === startYear ? `${startYear}` : `${startYear} – ${currentYear}`
            } <a href="https://github.com/Pinn32" target="_blank" rel="noopener noreferrer">Pinn Xu</a>. All rights reserved.
        </StyledFooter>
    )
}

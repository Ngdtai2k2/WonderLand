import { Box, Card, CardActions } from "@mui/material";
import { styled } from "@mui/material/styles";

export const CardActionsStyled = styled(CardActions)(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

export const CardStyled = styled(Card)(() => ({
  border: "1px solid rgba(0,0,0,0.12)",
  boxShadow: "none",
}));

export const BoxStyled = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
}));



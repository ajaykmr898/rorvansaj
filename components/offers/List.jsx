import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { offersService } from "../../services";

export { List };

function List({ items }) {
  return (
    <div className="container123">
      {items &&
        items.map((data, i) => (
          <Card variant="outlined" key={i}>
            <CardContent>
              {data && (
                <div>
                  <Typography variant="h5">{data.title}</Typography>
                  <Typography variant="body1">{data.description}</Typography>
                  <Typography variant="body2">Charge: {data.charge}</Typography>
                  <Typography variant="body2">From: {data.from}</Typography>
                  <Typography variant="body2">To: {data.to}</Typography>
                  <Typography variant="body2">
                    Types: {offersService.offer(data.types)}
                  </Typography>
                  <Typography variant="body2">UserId: {data.userId}</Typography>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
    </div>
  );
}

"use client";
import Link from "next/link";

import React from "react";
import { Grid, Typography, Button, Box, Card, CardContent } from "@mui/joy";
import { FaArrowRight } from "react-icons/fa6";

const Home: React.FC = () => {
    const [aggregatedData, setAggregatedData] = React.useState<any>(false);

    React.useEffect(() => {
        const fetchAggregatedData = async () => {
            try {
                const response = await fetch("http://localhost:3001/upload/aggregated-data");
                const result = await response.json();
                if (result) console.log("result", result);

                setAggregatedData(result);
            } catch (error) {
                console.error("Erro ao buscar dados agregados", error);
            }
        };

        fetchAggregatedData();
    }, []);
    return (
        <Grid container display="flex" spacing={2}>
            <Grid xs={12} display="flex" justifyContent="space-between" alignItems="center">
                <Typography level="h1">Dashboard</Typography>

                <Link href="/faturas">
                    <Button variant="soft">
                        <Typography level="h4"> Faturas</Typography> <FaArrowRight style={{ paddingLeft: 10, paddingTop: 2 }} />
                    </Button>
                </Link>
            </Grid>
            {!!aggregatedData && (
                <>
                    <Grid xs={12} pt={5}>
                        <Box
                            sx={{
                                width: "100%",
                                maxWidth: 700,
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                                gap: 2,
                            }}
                        >
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography level="title-md">Consumo de Energia Elétrica Total</Typography>
                                    <Typography level="h4">{aggregatedData.totalElectricEnergyConsumption.toFixed(2)} KWh</Typography>
                                </CardContent>
                            </Card>

                            <Card variant="outlined">
                                <CardContent>
                                    <Typography level="title-md">Total de Energia Compensada</Typography>
                                    <Typography level="h4">{aggregatedData.totalCompensatedEnergy.toFixed(2)} KWh</Typography>
                                </CardContent>
                            </Card>

                            <Card variant="soft">
                                <CardContent>
                                    <Typography level="title-md"> Valor Total sem GD</Typography>
                                    <Typography level="h4">{aggregatedData.totalValueWithoutGD.toFixed(2)} KWh</Typography>
                                </CardContent>
                            </Card>

                            <Card variant="soft">
                                <CardContent>
                                    <Typography level="title-md"> Total de Economia GD</Typography>
                                    <Typography level="h4">{-1 * aggregatedData.totalGDSavings.toFixed(2)} KWh</Typography>
                                </CardContent>
                            </Card>
                        </Box>
                    </Grid>
                </>
            )}
        </Grid>
    );
};

export default Home;


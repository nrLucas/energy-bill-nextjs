"use client";
import Link from "next/link";

import React from "react";
import { Grid, Typography, Button, List, ListItem, Modal, ModalDialog, ModalClose, DialogTitle, Stack, Input, Alert, Snackbar } from "@mui/joy";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { FaPlus, FaCheck } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa6";
import { CgClose } from "react-icons/cg";

import BasicLineChart from "@/components/chart";
import validationSchema from "@/validator";

const Faturas: React.FC = () => {
    const [open, setOpen] = React.useState<boolean>(false);
    const [openSnackbar, setOpenSnackbar] = React.useState<boolean>(false);
    const [snackbarContent, setSnackbarContent] = React.useState<string>("success");
    const [aggregatedData, setAggregatedData] = React.useState<any>(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const onSubmit = async (data: any) => {
        try {
            const formData = new FormData();
            formData.append("file", data.fatura[0]);

            const response = await fetch("http://localhost:3001/upload", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();

            if (result.success) {
                reset();
                setOpen(false);
                setOpenSnackbar(true);
                setSnackbarContent("success");
            } else {
                console.log("result", result);
                reset();
                setOpen(false);
                setOpenSnackbar(true);
                setSnackbarContent(result.statusCode === 500 ? "error2" : "error1");
            }
        } catch (err) {
            console.log("error22222222222", err);
            reset();
            setOpen(false);
            setOpenSnackbar(true);
            setSnackbarContent("error2");
        }
    };

    React.useEffect(() => {
        const fetchAggregatedData = async () => {
            try {
                const response = await fetch("http://localhost:3001/upload/aggregated-data");
                const result = await response.json();

                setAggregatedData(result);
            } catch (error) {
                console.error("Erro ao buscar dados agregados", error);
            }
        };

        fetchAggregatedData();
    }, []);

    return (
        <>
            <Grid container spacing={2}>
                <Grid xs={12} display="flex" justifyContent="space-between" alignItems="center">
                    <Typography level="h1"> Faturas</Typography>
                    <Button variant="outlined" color="neutral" onClick={() => setOpen(true)} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <FaPlus color="#38b000" style={{ paddingRight: 10, paddingTop: 2 }} /> <Typography level="h4"> Enviar Fatura</Typography>
                    </Button>
                    <Link href="/">
                        <Button variant="soft">
                            <Typography level="h4"> Dashboard</Typography> <FaArrowRight style={{ paddingLeft: 10, paddingTop: 2 }} />
                        </Button>
                    </Link>
                </Grid>
                {!!aggregatedData && (
                    <>
                        <Grid xs={12} pt={5}>
                            <Typography level="title-md"> Gráfico Consumo de Energia Elétrica (Verde) e Energia Compensada (Azul) - KWh</Typography>
                            <BasicLineChart
                                data={[
                                    {
                                        data: aggregatedData.monthlyElectricEnergyConsumption,
                                    },
                                    { data: aggregatedData.monthlyCompensatedEnergy },
                                ]}
                            />
                        </Grid>
                        <Grid xs={12}>
                            <Typography level="title-md">Gráfico Valor Total sem GD (Verde) e Economia GD (Azul) - R$</Typography>

                            <BasicLineChart
                                data={[
                                    {
                                        data: aggregatedData.monthlyValueWithoutGD,
                                    },
                                    { data: aggregatedData.monthlyGDSavings },
                                ]}
                            />
                        </Grid>
                    </>
                )}
            </Grid>
            <Modal open={open} onClose={() => setOpen(false)} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <ModalDialog>
                    <ModalClose />
                    <DialogTitle sx={{ pb: 2 }}>Enviar Fatura</DialogTitle>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Stack spacing={2}>
                            <Input autoFocus type="file" {...register("fatura")} />
                            {errors.fatura && <Alert color="danger"> {errors.fatura.message}</Alert>}

                            <Button type="submit">Enviar</Button>
                        </Stack>
                    </form>
                </ModalDialog>
            </Modal>
            <Snackbar
                autoHideDuration={4000}
                size="lg"
                variant="soft"
                open={openSnackbar}
                color={snackbarContent === "success" ? "success" : "danger"}
                onClose={(event, reason) => {
                    if (reason === "clickaway") {
                        return;
                    }
                    setOpenSnackbar(false);
                }}
            >
                {snackbarContent === "success" ? (
                    <>
                        <FaCheck />
                        <Typography>Fatura cadastrada com sucesso!</Typography>
                    </>
                ) : snackbarContent === "error2" ? (
                    <>
                        <CgClose />
                        <Typography>Houve um erro! Não foi possível cadastrar a fatura! </Typography>
                    </>
                ) : (
                    <>
                        <CgClose />
                        <Typography>Não foi possível extrair nenhum dado da fatura! Fatura não cadastrada!</Typography>
                    </>
                )}
            </Snackbar>
        </>
    );
};

export default Faturas;

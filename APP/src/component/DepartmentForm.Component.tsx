import axios from "axios";
import {
  Card,
  createStyles,
  Group,
  Text,
  SelectItem,
  Button,
  TextInput,
  Textarea,
  NativeSelect,
} from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import * as Yup from "yup";
import { Department } from "../model/Department.model";
import { useEffect, useState } from "react";
import { IconCheck, IconX } from "@tabler/icons";
import { showNotification } from "@mantine/notifications";
import { useSelector } from "react-redux";
import { RootState } from "../store/app.store";

const useStyles = createStyles((theme) => ({
  root: {
    position: "relative",
  },

  input: {
    height: "auto",
    paddingTop: 18,
  },

  label: {
    position: "absolute",
    pointerEvents: "none",
    fontSize: theme.fontSizes.xs,
    paddingLeft: theme.spacing.sm,
    paddingTop: theme.spacing.sm / 2,
    zIndex: 1,
  },
}));

interface DepartmentFormProps {
  mode: "new" | "update";
  id: number;
  callback: Function;
}

export function DepartmentFormComponent(props: DepartmentFormProps) {
  const API = useSelector((state: RootState) => state.constantSlice.api);
  const { mode, id, callback } = props;
  const { classes } = useStyles();
  const [departments, setDepartments] = useState<SelectItem[]>([]);
  const [Loading, setLoading] = useState<boolean>(false);

  const schema = Yup.object().shape({
    name: Yup.string()
      .min(2, "Name should have at least 2 letters")
      .required("Name required"),
    description: Yup.string()
      .min(5, "Description too short")
      .required("Description required"),
    DepartmentId: Yup.string(),
  });

  const initialValues = {
    id: -1,
    name: "",
    description: "",
    ceo: false,
    DepartmentId: "",
    Department: [],
  };

  const form = useForm({
    validate: yupResolver(schema),
    initialValues: initialValues,
  });

  function onSubmit() {
    let validationResult = form.validate();
    if (!validationResult.hasErrors) {
      let data = form.values;
      setLoading(true);
      if (mode === "new") {
        createDepartment(data);
      } else {
        updateDepartment(data);
      }
    }
  }

  function createDepartment(data: any) {
    console.log({ ...data, DepartmentId: data.DepartmentId + "" });
    console.log(data);
    axios({
      method: "post",
      url: API + "/departments/",
      data: { ...data, DepartmentId: data.DepartmentId + "" },
    })
      .then((response) => {
        showNotification({
          title: "Success",
          message: response.data.message,
          color: "teal",
          icon: <IconCheck />,
        });
        LoadDepartments();
        setLoading(false);
        callback();
      })
      .catch((e) => {
        if (e.response) {
          let data = e.response.data;
          showNotification({
            title: data.message,
            message:
              data.data &&
              data.data.length > 0 &&
              typeof data.data === typeof "string"
                ? data.data.join("\n")
                : "",
            color: "red",
            icon: <IconX />,
          });
        } else {
          showNotification({
            title: "Error",
            message: "Unable to create department",
            color: "red",
            icon: <IconX />,
          });
        }
        setLoading(false);
      });
  }

  function updateDepartment(data: any) {
    console.log({ ...data, DepartmentId: data.DepartmentId + "" });
    console.log(data);
    axios({
      method: "put",
      url: API + "/departments/" + id,
      data: { ...data, DepartmentId: data.DepartmentId + "" },
    })
      .then((response) => {
        showNotification({
          title: "Success",
          message: response.data.message,
          color: "teal",
          icon: <IconCheck />,
        });
        LoadDepartments();
        setLoading(false);
        callback();
      })
      .catch((e) => {
        if (e.response) {
          let data = e.response.data;
          showNotification({
            title: data.message,
            message: "",
            color: "red",
            icon: <IconX />,
          });
        } else {
          showNotification({
            title: "Error",
            message: "Unable to update department",
            color: "red",
            icon: <IconX />,
          });
        }
        setLoading(false);
      });
  }

  function LoadDepartments() {
    axios({
      method: "get",
      url: API + "/departments",
    })
      .then((response) => {
        let departments: SelectItem[] = [];
        let data = response["data"]["data"];
        data.map((value: Department) => {
          departments.push({
            label: value.name,
            value: value.id + "",
          });
        });
        setDepartments(departments);
        if (mode === "update") {
          LoadDepartment();
        } else if (mode === "new") {
          form.setFieldValue("DepartmentId", props.id + "");
        }
      })
      .catch((e) => {
        showNotification({
          title: "Error",
          message: "Unable to fetch department list",
          color: "red",
          icon: <IconX />,
        });
      });
  }

  function LoadDepartment() {
    axios({
      method: "get",
      url: API + "/departments/" + id,
    })
      .then((response) => {
        let data = response["data"]["data"];
        form.setFieldValue("DepartmentId", data.DepartmentId);
        form.setFieldValue("name", data.name);
        form.setFieldValue("description", data.description);
      })
      .catch((e) => {
        showNotification({
          title: "Error",
          message: "Unable to fetch department list",
          color: "red",
          icon: <IconX />,
        });
        callback();
      });
  }

  useEffect(() => {
    LoadDepartments();
  }, [setDepartments]);

  return (
    <>
      <Group position="left" className={"-mt-8 mb-8"}>
        <Text className={"text-2xl font-semibold"}>
          {(mode === "new" ? "Create" : "Update") + " Department"}
        </Text>
      </Group>

      <Card.Section>
        <div>
          <TextInput
            label="Name"
            placeholder="Department Name"
            classNames={classes}
            withAsterisk
            {...form.getInputProps("name")}
          />

          <Textarea
            className={"mt-5"}
            label="Description"
            placeholder="Department description"
            classNames={classes}
            withAsterisk
            autosize
            minRows={4}
            {...form.getInputProps("description")}
          />

          <NativeSelect
            className={"mt-5"}
            data={departments}
            placeholder="Immediate Department"
            label="Immediate Department"
            withAsterisk
            value={form.values.DepartmentId}
            classNames={classes}
            onChange={(event) => {
              form.setFieldValue("DepartmentId", event.currentTarget.value);
            }}
          />
        </div>
      </Card.Section>

      <Button
        loading={Loading}
        variant="filled"
        color="blue"
        mt="md"
        radius="sm"
        onClick={onSubmit}
      >
        {mode === "new" ? "Create" : "Update"}
      </Button>
    </>
  );
}

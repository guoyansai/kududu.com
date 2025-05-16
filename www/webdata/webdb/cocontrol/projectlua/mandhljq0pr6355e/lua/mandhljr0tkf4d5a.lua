
a = 10
while ( a < 200) do
	movJ({
		jp = {
			195.049,
			0,
			163.01,
			0,
			0,
			17.235
		}
	}, {
		v = 1000,
		a = 3000,
		b = 100,
		coor = "",
		tool = "",
		search = "DI(1) == 1",
		onpercent = {
			{
				30,
				"DO(3, 1) DO(4, 1)"
			},
			{
				80,
				"DO(3, 0) DO(4, 0)"
			}
		}
	})
	movJ({
		jp = {
			225.049,
			0,
			93.01,
			0,
			0,
			33.235
		}
	}, {
		v = 1000,
		a = 3000,
		b = 100,
		coor = "",
		tool = "",
		search = "DI(1) == 1",
		onpercent = {
			{
				30,
				"DO(3, 1) DO(4, 1)"
			},
			{
				80,
				"DO(3, 0) DO(4, 0)"
			}
		}
	})

	print("a 的值为:", a)
	a = a + 1
end
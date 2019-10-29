using Microsoft.VisualStudio.TestTools.UnitTesting;
//Sistema

using System;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;
using System.Drawing.Imaging;

//NUnit
using NUnit.Framework;

using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Support.UI;

using System.IO;
using System.Collections;

namespace SeleniumLearn
{
    [TestFixture]
    public class UnitTest1
    {

        public IWebDriver driver;
        private String baseURL;
        public String screenshotsPasta;
        int count = 1;
        IJavaScriptExecutor js;

        public int gerarCracha()
        {
           Random random = new Random();
           int rnd = random.Next(1000);
           return rnd;
        }

        public string gerarSenha()
        {
            string path = Path.GetRandomFileName();
            path = path.Replace(".", ""); // Remove period.

            if (path.Length < 5)
            {
                while (path.Length < 5)
                {
                    path = Path.GetRandomFileName();
                    path = path.Replace(".", ""); // Remove period.
                }
            }

            if (path.Length > 10)
            {
               Int32 a = path.Length;
                for (var i = 0; a != 10; a--); 
                path = path.Substring(0,a); 
            }

            return path;
        }

        public string gerarString()
        {
            string path = Path.GetRandomFileName();
            path = path.Replace(".", ""); // Remove period.
            return path;
        }

        public string gerarEmail()
        {
            string path = Path.GetRandomFileName();
            path = path.Replace(".", ""); // Remove period.
            path = path + "@hotmail.com";
            return path;
        }


        public string gerarData()
        {
            Random rnd = new Random();
            int ano = rnd.Next(1950, 2016);
            int mes = rnd.Next(1, 12);
            int dia = DateTime.DaysInMonth(ano, mes);
            int Dia = rnd.Next(1, dia);
            var data = Convert.ToString(Dia);
            data = data + Convert.ToString(mes);
            data = data + Convert.ToString(ano);
            return data;
        }

        public string gerarCPF()
        {
            int soma = 0, resto = 0;
            int[] multiplicador1 = new int[9] { 10, 9, 8, 7, 6, 5, 4, 3, 2 };
            int[] multiplicador2 = new int[10] { 11, 10, 9, 8, 7, 6, 5, 4, 3, 2 };

            Random rnd = new Random();
            string semente = rnd.Next(100000000, 999999999).ToString();

            for (int i = 0; i < 9; i++)
                soma += int.Parse(semente[i].ToString()) * multiplicador1[i];

            resto = soma % 11;
            if (resto < 2)
                resto = 0;
            else
                resto = 11 - resto;

            semente = semente + resto;
            soma = 0;

            for (int i = 0; i < 10; i++)
                soma += int.Parse(semente[i].ToString()) * multiplicador2[i];

            resto = soma % 11;

            if (resto < 2)
                resto = 0;
            else
                resto = 11 - resto;

            semente = semente + resto;
            return semente;
        }


        public void Screenshot(IWebDriver driver, string screenshotsPasta)
        {
            ITakesScreenshot camera = driver as ITakesScreenshot;
            Screenshot foto = camera.GetScreenshot();
            foto.SaveAsFile(screenshotsPasta, ScreenshotImageFormat.Jpeg);
        }

        [SetUp]
        public void SetupTest()
        {
            driver = new ChromeDriver();
            driver.Manage().Window.Maximize();
            baseURL = "localhost:8081/cadastrarusuario";
            screenshotsPasta = @"C:\Users\Lucas Herculano\Documents\tg\nodejs\sc\sc";
        }

        public void capturaImagem()
        {
            Screenshot(driver, screenshotsPasta + "cadUsu_" + count++ + ".jpeg");
            Thread.Sleep(500);
        }

        [TearDown]
        public void TeardownTest(){
            try
            {
                driver.Quit();
            }
            catch (Exception)
            {

            }
        }
        [Test]
        public void NomeDoTeste()
        {
            js = (IJavaScriptExecutor)driver;

            driver.Navigate().GoToUrl(baseURL);

            Thread.Sleep(1000);
            capturaImagem();



            driver.FindElement(By.Name("Cracha")).
                SendKeys(Convert.ToString(gerarCracha()));

            driver.FindElement(By.Name("Nome")).
                SendKeys(Convert.ToString(gerarString()));

            driver.FindElement(By.Name("Cargo")).
                SendKeys(Convert.ToString(gerarString()));

            driver.FindElement(By.Name("Logradouro")).
                SendKeys(Convert.ToString(gerarString()));

            driver.FindElement(By.Name("Numero")).
                SendKeys(Convert.ToString(gerarCracha()));

            driver.FindElement(By.Name("Bairro")).
                SendKeys(Convert.ToString(gerarString()));

            driver.FindElement(By.Name("Cidade")).
                SendKeys(Convert.ToString(gerarString()));

            var estado = driver.FindElement(By.Name("Estado"));
            var selectElement = new SelectElement(estado);
            selectElement.SelectByText("SP");

            var A = gerarSenha();

            driver.FindElement(By.Name("Senha")).
                SendKeys(Convert.ToString(A));

            driver.FindElement(By.Name("Senha2")).
                SendKeys(Convert.ToString(A));

            driver.FindElement(By.Name("Email")).
                SendKeys(Convert.ToString(gerarEmail()));

            driver.FindElement(By.Name("CPFn")).
                SendKeys(Convert.ToString(gerarCPF()));

            driver.FindElement(By.Name("DataNascimento")).
                SendKeys(Convert.ToString(gerarData()));

            driver.FindElement(By.Name("DataAdmissao")).
                SendKeys(Convert.ToString(gerarData()));

            Thread.Sleep(1000);
            capturaImagem();

            var cadastrar = driver.FindElement(By.ClassName("btn"));
            cadastrar.Submit();

            Thread.Sleep(1000);
            capturaImagem();

        }

    }
}
